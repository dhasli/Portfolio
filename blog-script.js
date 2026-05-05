/* ============================================================
   SHIBU A — BLOG SCRIPT  v3
   Comments: Firebase Firestore backend (persistent, real-time)
   UI:       Existing frontend fully preserved
   Security: API key loaded from firebase-config.js (git-ignored)
   ============================================================ */

import { firebaseConfig } from './firebase-config.js';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp, onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── Init ──
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Auto-detect which blog page → separate Firestore collection per post ──
// blog-16tb.html    → "comments-16tb"
// blog-dmz-lab.html → "comments-dmz"
// Any future post   → works automatically
const pageName   = location.pathname.split('/').pop().replace('.html','').replace('blog-','') || 'general';
const COLLECTION = `comments-${pageName}`;

/* ═══════════════════════════════════════════════════════════
   LOAD COMMENTS — real-time listener
   Appends to #commentsList, leaving seed/static comments alone
═══════════════════════════════════════════════════════════ */
function startRealtimeComments() {
  const list = document.getElementById('commentsList');
  if (!list) return;

  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'asc'));

  onSnapshot(q, (snapshot) => {
    // Remove only Firebase-sourced elements, keep hardcoded seed comments
    list.querySelectorAll('.comment-item[data-firebase]').forEach(el => el.remove());

    snapshot.forEach(docSnap => {
      list.appendChild(buildFirebaseComment(docSnap.data(), docSnap.id));
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   BUILD COMMENT ELEMENT — matches existing .comment-item HTML
═══════════════════════════════════════════════════════════ */
function buildFirebaseComment(data, docId) {
  const el       = document.createElement('div');
  el.className   = 'comment-item';
  el.dataset.firebase = docId;

  const initial = (data.name || 'A').charAt(0).toUpperCase();
  const palette = hashColor(data.name || '');
  const likes   = data.likes || 0;

  el.innerHTML = `
    <div class="comment-avatar ci-av-fb"
         style="background:${palette.bg};color:${palette.fg};">${initial}</div>
    <div class="comment-body">
      <div class="comment-header">
        <span class="comment-name">${escapeHtml(data.name || 'Anonymous')}</span>
        ${data.role ? `<span class="comment-role">${escapeHtml(data.role)}</span>` : ''}
        <span class="comment-time">${formatTime(data.createdAt)}</span>
      </div>
      <p class="comment-text">${escapeHtml(data.text || '').replace(/\n/g,'<br>')}</p>
      <div class="comment-actions">
        <button class="ca-btn fb-like-btn" data-id="${docId}" data-likes="${likes}">
          <i class="fa-regular fa-thumbs-up"></i> <span>${likes}</span>
        </button>
        <button class="ca-btn reply-btn" onclick="showReplyBox(this)">
          <i class="fa-regular fa-comment"></i> Reply
        </button>
      </div>
    </div>`;

  // Like — persisted to Firestore, one per session
  el.querySelector('.fb-like-btn').addEventListener('click', async function () {
    if (this.classList.contains('liked')) return;
    this.classList.add('liked');
    this.querySelector('i').className = 'fa-solid fa-thumbs-up';
    const newLikes = parseInt(this.dataset.likes) + 1;
    this.querySelector('span').textContent = newLikes;
    this.dataset.likes = newLikes;
    try { await updateDoc(doc(db, COLLECTION, docId), { likes: newLikes }); }
    catch (e) { console.warn('Like update failed:', e); }
  });

  return el;
}

/* ═══════════════════════════════════════════════════════════
   SUBMIT COMMENT — replaces local-only version, same UX
═══════════════════════════════════════════════════════════ */
async function submitComment() {
  const nameEl = document.getElementById('commenterName');
  const roleEl = document.getElementById('commenterRole');
  const textEl = document.getElementById('commentText');
  const btn    = document.querySelector('.cf-submit');

  const name = nameEl.value.trim();
  const role = roleEl ? roleEl.value.trim() : '';
  const text = textEl.value.trim();

  if (!name) { shake(nameEl); nameEl.focus(); return; }
  if (!text) { shake(textEl); textEl.focus(); return; }

  const original = btn.innerHTML;
  btn.innerHTML  = '<i class="fa-solid fa-spinner fa-spin"></i> Posting…';
  btn.disabled   = true;

  try {
    await addDoc(collection(db, COLLECTION), {
      name, role, text, likes: 0, createdAt: serverTimestamp()
    });

    nameEl.value = '';
    if (roleEl) roleEl.value = '';
    textEl.value = '';
    const cc = document.getElementById('charCount');
    if (cc) cc.textContent = '0 / 1200';

    document.getElementById('commentsList')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (err) {
    console.error('Firestore write error:', err);
    alert('Could not post comment. Please try again.');
  } finally {
    btn.innerHTML = original;
    btn.disabled  = false;
  }
}
window.submitComment = submitComment;

/* ═══════════════════════════════════════════════════════════
   EXISTING FRONTEND — UNCHANGED
═══════════════════════════════════════════════════════════ */

// ── Char counter ──
const commentText = document.getElementById('commentText');
const charCount   = document.getElementById('charCount');
if (commentText && charCount) {
  commentText.addEventListener('input', () => {
    charCount.textContent = `${commentText.value.length} / 1200`;
    charCount.style.color = commentText.value.length > 1100 ? '#f87171' : '';
  });
}
if (commentText) {
  commentText.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') submitComment();
  });
}

// ── Navbar ──
window.addEventListener('scroll', () => {
  document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Like (seed/static comments only) ──
window.likeComment = function (btn) {
  if (btn.classList.contains('fb-like-btn')) return;
  const countEl = btn.querySelector('span');
  const icon    = btn.querySelector('i');
  if (btn.classList.contains('liked')) {
    btn.classList.remove('liked');
    icon.className      = 'fa-regular fa-thumbs-up';
    countEl.textContent = parseInt(countEl.textContent) - 1;
  } else {
    btn.classList.add('liked');
    icon.className      = 'fa-solid fa-thumbs-up';
    countEl.textContent = parseInt(countEl.textContent) + 1;
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => btn.style.transform = '', 200);
  }
};

// ── Reply box ──
window.showReplyBox = function (btn) {
  const body     = btn.closest('.comment-body');
  const existing = body.querySelector('.reply-box-wrap');
  if (existing) { existing.remove(); return; }
  const wrap = document.createElement('div');
  wrap.className = 'reply-box-wrap';
  wrap.innerHTML = `
    <textarea class="reply-input" placeholder="Write a reply…" rows="3" maxlength="600"></textarea>
    <div class="reply-actions">
      <button class="reply-cancel" onclick="this.closest('.reply-box-wrap').remove()">Cancel</button>
      <button class="reply-submit" onclick="postReply(this)">Reply</button>
    </div>`;
  body.appendChild(wrap);
  wrap.querySelector('.reply-input').focus();
};

window.postReply = function (btn) {
  const wrap     = btn.closest('.reply-box-wrap');
  const textarea = wrap.querySelector('.reply-input');
  const text     = textarea.value.trim();
  if (!text) { shake(textarea); return; }
  const body = wrap.closest('.comment-body');
  let rc     = body.querySelector('.replies-container');
  if (!rc) {
    rc = document.createElement('div');
    rc.className = 'replies-container';
    body.insertBefore(rc, wrap);
  }
  const replyEl = document.createElement('div');
  replyEl.className = 'reply-item';
  replyEl.innerHTML = `
    <div class="reply-avatar">Y</div>
    <div class="reply-body">
      <div class="reply-name">You <span style="font-size:10px;color:var(--text-muted);font-weight:400;margin-left:4px">· Just now</span></div>
      <div class="reply-text">${escapeHtml(text).replace(/\n/g,'<br>')}</div>
    </div>`;
  rc.appendChild(replyEl);
  wrap.remove();
};

// ── Utilities ──
function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation   = 'shake 0.4s ease';
  el.style.borderColor = '#f87171';
  setTimeout(() => { el.style.animation = ''; el.style.borderColor = ''; }, 600);
}
window.shake = shake;

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function formatTime(ts) {
  if (!ts) return 'Just now';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff  = Math.floor((Date.now() - date) / 1000);
  if (diff < 60)     return 'Just now';
  if (diff < 3600)   return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400)  return `${Math.floor(diff/3600)} hr ago`;
  if (diff < 604800) return `${Math.floor(diff/86400)} days ago`;
  return date.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
}

function hashColor(name) {
  const p = [
    {bg:'rgba(79,143,230,0.2)',  fg:'#60a5fa'},
    {bg:'rgba(124,106,247,0.2)', fg:'#a78bfa'},
    {bg:'rgba(34,197,94,0.2)',   fg:'#4ade80'},
    {bg:'rgba(234,179,8,0.2)',   fg:'#facc15'},
    {bg:'rgba(251,146,60,0.2)',  fg:'#fb923c'},
    {bg:'rgba(236,72,153,0.2)',  fg:'#f472b6'},
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h<<5)-h);
  return p[Math.abs(h) % p.length];
}

// ── Inject styles ──
const _s = document.createElement('style');
_s.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)}
    40%{transform:translateX(6px)}  60%{transform:translateX(-4px)} 80%{transform:translateX(4px)}
  }
  .ci-av-fb{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;
    justify-content:center;font-weight:700;font-size:15px;flex-shrink:0;margin-top:2px;}
  .fb-like-btn.liked{color:var(--accent);}
`;
document.head.appendChild(_s);

// ── Boot ──
startRealtimeComments();
