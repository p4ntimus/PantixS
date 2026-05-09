// --- Mobile 100vh Fix ---
function updateVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
updateVH();
window.addEventListener('resize', updateVH);

// --- Firebase Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyC-hBSCx7SICKQ7ntYFcJIwgR5zsewj8hg",
  authDomain: "pantixs.firebaseapp.com",
  projectId: "pantixs",
  storageBucket: "pantixs.firebasestorage.app",
  messagingSenderId: "397472052167",
  appId: "1:397472052167:web:b769b80410f86711cd9fe2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, "messages");

// --- DOM Elements ---
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const inputArea = document.getElementById("inputArea");
const messages = document.getElementById("messages");

// --- Username Overlay ---
let username = localStorage.getItem("privatechat_username");

const overlay = document.getElementById("username-overlay");
const usernameInput = document.getElementById("usernameInput");
const saveUsernameBtn = document.getElementById("saveUsernameBtn");

if (!username) {
  overlay.style.display = "flex";
} else {
  overlay.style.display = "none";
}

saveUsernameBtn.onclick = () => {
  const name = usernameInput.value.trim();
  if (!name) return;

  localStorage.setItem("privatechat_username", name);
  username = name;
  overlay.style.display = "none";
};

// --- Zeitformat ---
function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// --- Nachricht senden ---
sendBtn.onclick = async () => {
  const text = messageInput.value.trim();
  if (!text || !username) return;

  await addDoc(messagesRef, {
    text,
    user: username,
    createdAt: serverTimestamp()
  });

  messageInput.value = "";
  messageInput.style.height = "46px"; // Reset nach Senden
};

// --- Nachrichten live laden ---
const q = query(messagesRef, orderBy("createdAt"));

onSnapshot(q, (snapshot) => {
  messagesDiv.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();

    const msg = document.createElement("div");
    msg.className = data.user === username ? "message me" : "message other";

    msg.innerHTML = `
      <div>${data.text}</div>
      <div class="time">${formatTime(data.createdAt)}</div>
    `;

    messagesDiv.appendChild(msg);
  });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// --- Auto-Resize für Textarea ---
messageInput.addEventListener("input", () => {
  messageInput.style.height = "auto";
  messageInput.style.height = messageInput.scrollHeight + "px";
});

// --- Keyboard Push Fix ---
window.addEventListener("focusin", () => {
  inputArea.style.position = "absolute";
});

window.addEventListener("focusout", () => {
  inputArea.style.position = "fixed";
});
