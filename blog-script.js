/* ============================================================
   SHIBU A — BLOG SCRIPT
   Handles: comments, replies, likes, char counter
   ============================================================ */

// ── Character counter ──
const commentText = document.getElementById('commentText');
const charCount = document.getElementById('charCount');
if (commentText && charCount) {
  commentText.addEventListener('input', () => {
    charCount.textContent = `${commentText.value.length} / 1200`;
    charCount.style.color = commentText.value.length > 1100 ? '#f87171' : '';
  });
}

// ── Navbar scroll ──
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Submit a new comment ──
function submitComment() {
  const nameEl = document.getElementById('commenterName');
  const roleEl = document.getElementById('commenterRole');
  const textEl = document.getElementById('commentText');

  const name = nameEl.value.trim();
  const role = roleEl.value.trim();
  const text = textEl.value.trim();

  if (!name) { shake(nameEl); nameEl.focus(); return; }
  if (!text) { shake(textEl); textEl.focus(); return; }

  const initial = name.charAt(0).toUpperCase();
  const timeStr = 'Just now';

  const commentEl = document.createElement('div');
  commentEl.className = 'comment-item';
  commentEl.innerHTML = `
    <div class="comment-avatar ci-av-new">${initial}</div>
    <div class="comment-body">
      <div class="comment-header">
        <span class="comment-name">${escapeHtml(name)}</span>
        ${role ? `<span class="comment-role">${escapeHtml(role)}</span>` : ''}
        <span class="comment-time">${timeStr}</span>
      </div>
      <p class="comment-text">${escapeHtml(text).replace(/\n/g, '<br>')}</p>
      <div class="comment-actions">
        <button class="ca-btn" onclick="likeComment(this)">
          <i class="fa-regular fa-thumbs-up"></i> <span>0</span>
        </button>
        <button class="ca-btn reply-btn" onclick="showReplyBox(this)">
          <i class="fa-regular fa-comment"></i> Reply
        </button>
      </div>
    </div>
  `;

  const list = document.getElementById('commentsList');
  list.prepend(commentEl);

  // Scroll to new comment
  commentEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Reset form
  nameEl.value = '';
  roleEl.value = '';
  textEl.value = '';
  charCount.textContent = '0 / 1200';
}

// ── Like a comment ──
function likeComment(btn) {
  const countEl = btn.querySelector('span');
  const icon = btn.querySelector('i');

  if (btn.classList.contains('liked')) {
    btn.classList.remove('liked');
    icon.className = 'fa-regular fa-thumbs-up';
    countEl.textContent = parseInt(countEl.textContent) - 1;
  } else {
    btn.classList.add('liked');
    icon.className = 'fa-solid fa-thumbs-up';
    countEl.textContent = parseInt(countEl.textContent) + 1;
    // quick pulse animation
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => btn.style.transform = '', 200);
  }
}

// ── Show reply box under a comment ──
function showReplyBox(btn) {
  const commentBody = btn.closest('.comment-body');

  // Remove any existing reply box on this comment
  const existing = commentBody.querySelector('.reply-box-wrap');
  if (existing) { existing.remove(); return; }

  const wrap = document.createElement('div');
  wrap.className = 'reply-box-wrap';
  wrap.innerHTML = `
    <textarea class="reply-input" placeholder="Write a reply..." rows="3" maxlength="600"></textarea>
    <div class="reply-actions">
      <button class="reply-cancel" onclick="this.closest('.reply-box-wrap').remove()">Cancel</button>
      <button class="reply-submit" onclick="postReply(this)">Reply</button>
    </div>
  `;

  commentBody.appendChild(wrap);
  wrap.querySelector('.reply-input').focus();
}

// ── Post a reply ──
function postReply(btn) {
  const wrap = btn.closest('.reply-box-wrap');
  const textarea = wrap.querySelector('.reply-input');
  const text = textarea.value.trim();

  if (!text) { shake(textarea); return; }

  const commentBody = wrap.closest('.comment-body');
  let repliesContainer = commentBody.querySelector('.replies-container');

  if (!repliesContainer) {
    repliesContainer = document.createElement('div');
    repliesContainer.className = 'replies-container';
    // Insert before reply-box-wrap
    commentBody.insertBefore(repliesContainer, wrap);
  }

  const replyEl = document.createElement('div');
  replyEl.className = 'reply-item';
  replyEl.innerHTML = `
    <div class="reply-avatar">Y</div>
    <div class="reply-body">
      <div class="reply-name">You <span style="font-size:10px;color:var(--text-muted);font-weight:400;margin-left:4px">· Just now</span></div>
      <div class="reply-text">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
    </div>
  `;

  repliesContainer.appendChild(replyEl);
  wrap.remove();
}

// ── Utility: shake animation for validation ──
function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  el.style.borderColor = '#f87171';
  setTimeout(() => { el.style.animation = ''; el.style.borderColor = ''; }, 600);
}

// ── Utility: escape HTML ──
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Inject shake keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(style);

// ── Allow Ctrl+Enter to submit ──
if (commentText) {
  commentText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') submitComment();
  });
}
