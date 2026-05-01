// ─────────────────────────────────────────
// FIREBASE IMPORTS
// ─────────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ─────────────────────────────────────────
// FIREBASE CONFIG (REPLACE YOURS)
// ─────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDB34Vh7nOITktPdtRf3HmM4p4QndtAHyA",
  authDomain: "blog-database-99391.firebaseapp.com",
  projectId: "blog-database-99391"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─────────────────────────────────────────
// DOM ELEMENTS
// ─────────────────────────────────────────
const input = document.getElementById("commentInput");
const button = document.getElementById("postCommentBtn");
const counter = document.getElementById("charCount");
const container = document.getElementById("commentsContainer");

// ─────────────────────────────────────────
// CHARACTER COUNTER + BUTTON STATE
// ─────────────────────────────────────────
button.disabled = true;

input.addEventListener("input", () => {
  const length = input.value.length;
  counter.textContent = `${length} / 500`;

  button.disabled = input.value.trim().length === 0;
});

// ─────────────────────────────────────────
// POST COMMENT
// ─────────────────────────────────────────
button.addEventListener("click", async () => {
  const text = input.value.trim();

  if (!text) return;

  button.disabled = true;
  button.innerHTML = "Posting...";

  try {
    await addDoc(collection(db, "comments"), {
      message: text,
      author: "Shibu A",
      createdAt: serverTimestamp(),
      likes: 0
    });

    input.value = "";
    counter.textContent = "0 / 500";

    await loadComments();

  } catch (err) {
    console.error("Error:", err);
    alert("Failed to post comment");
  }

  button.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Post Comment`;
  button.disabled = true;
});

// ─────────────────────────────────────────
// LOAD COMMENTS
// ─────────────────────────────────────────
async function loadComments() {
  container.innerHTML = "";

  const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

snapshot.forEach(doc => {
  const data = doc.data();
  const commentEl = createCommentElement(data, doc.id);
  container.appendChild(commentEl);
});
}

// ─────────────────────────────────────────
// CREATE COMMENT UI
// ─────────────────────────────────────────
function createCommentElement(data, docId) {
  const wrapper = document.createElement("div");
 wrapper.className = "comment-item";

  const initials = getInitials(data.author);

  wrapper.innerHTML = `
    <div class="comment-avatar">${initials}</div>

    <div class="comment-body">

      <div class="comment-top">
        <span class="comment-author">${data.author}</span>
        ${data.author === "Shibu A" ? `<span class="comment-badge">Author</span>` : ""}
        <span class="comment-time">${formatTime(data.createdAt)}</span>
      </div>

      <p class="comment-text">${escapeHTML(data.message)}</p>

<div class="comment-actions">
  <button class="comment-like">
    <i class="fa-regular fa-thumbs-up"></i> ${data.likes || 0}
  </button>

  ${data.author === "Shibu A" ? `
    <button class="comment-delete" data-id="${docId}">
      <i class="fa-solid fa-trash"></i>
    </button>
  ` : ""}
</div>

    </div>
  `;

  return wrapper;
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

// Initials for avatar
function getInitials(name) {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();
}

// Prevent HTML injection
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[tag]));
}

// Time formatting
function formatTime(timestamp) {
  if (!timestamp) return "Just now";

  const date = timestamp.toDate();
  const diff = Math.floor((Date.now() - date) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

  return date.toLocaleDateString();
}

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────
loadComments();

import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
container.addEventListener("click", async (e) => {
  const btn = e.target.closest(".comment-delete");
  if (!btn) return;

  const id = btn.dataset.id;

  if (!confirm("Delete this comment?")) return;

  try {
    await deleteDoc(doc(db, "comments", id));
    loadComments();
  } catch (err) {
    console.error(err);
    alert("Failed to delete");
  }
});