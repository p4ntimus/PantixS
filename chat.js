// --- Mobile 100vh Fix ---
function updateVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
updateVH();
window.addEventListener('resize', updateVH);

// --- Firebase Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, serverTimestamp, 
  onSnapshot, query, orderBy, updateDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// --- Reaction Set (WhatsApp + Extra) ---
const REACTIONS = ["👍","❤️","😂","😮","😢","😡","🔥","😍","🤯","👀","👏"];

// --- DOM Elements ---
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const inputArea = document.getElementById("inputArea");

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
    createdAt: serverTimestamp(),
    reactions: {} // Multi-Reactions
  });

  messageInput.value = "";
  messageInput.style.height = "46px";
};

// --- Nachrichten live laden ---
const q = query(messagesRef, orderBy("createdAt"));

onSnapshot(q, (snapshot) => {
  messagesDiv.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;

    const msg = document.createElement("div");
    msg.className = data.user === username ? "message me" : "message other";

    // Text + Zeit
    const textDiv = document.createElement("div");
    textDiv.textContent = data.text;

    const timeDiv = document.createElement("div");
    timeDiv.className = "time";
    timeDiv.textContent = formatTime(data.createdAt);

    msg.appendChild(textDiv);
    msg.appendChild(timeDiv);

    // --- iMessage-Style Reaction Stack ---
    if (data.reactions && Object.keys(data.reactions).length > 0) {
      const stack = document.createElement("div");
      stack.className = "reaction-stack";

      Object.entries(data.reactions).forEach(([emoji, users]) => {
        if (!users || users.length === 0) return;

        const chip = document.createElement("div");
        chip.className = "reaction-chip";

        const emojiSpan = document.createElement("span");
        emojiSpan.textContent = emoji;

        const countSpan = document.createElement("span");
        countSpan.textContent = users.length;

        chip.appendChild(emojiSpan);
        chip.appendChild(countSpan);
        stack.appendChild(chip);
      });

      msg.appendChild(stack);
    }

    // --- Long Press für Reaction Popup ---
    let pressTimer;

    msg.addEventListener("touchstart", () => {
      pressTimer = setTimeout(() => {
        showReactionPopup(msg, id, data.reactions || {});
      }, 400);
    });

    msg.addEventListener("touchend", () => clearTimeout(pressTimer));
    msg.addEventListener("touchmove", () => clearTimeout(pressTimer));

    // Optional für PC (Rechtsklick)
    msg.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showReactionPopup(msg, id, data.reactions || {});
    });

    messagesDiv.appendChild(msg);
  });

  messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: "smooth" });
});

// --- Auto-Resize für Textarea ---
messageInput.addEventListener("input", () => {
  messageInput.style.height = "auto";
  messageInput.style.height = messageInput.scrollHeight + "px";
});

// --- Keyboard Fix ---
window.addEventListener("focusin", () => {
  inputArea.classList.add("keyboard-open");
});

window.addEventListener("focusout", () => {
  inputArea.classList.remove("keyboard-open");
});

// --- Reaction speichern / entfernen (Multi) ---
async function toggleReaction(messageId, emoji, currentReactions) {
  const reactions = { ...currentReactions };

  if (!reactions[emoji]) reactions[emoji] = [];

  const index = reactions[emoji].indexOf(username);

  if (index === -1) {
    reactions[emoji].push(username);
  } else {
    reactions[emoji].splice(index, 1);
    if (reactions[emoji].length === 0) delete reactions[emoji];
  }

  const messageRef = doc(db, "messages", messageId);
  await updateDoc(messageRef, { reactions });
}

// --- Reaction Popup ---
function showReactionPopup(msgElement, messageId, currentReactions) {
  const existing = msgElement.querySelector(".reaction-popup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.className = "reaction-popup";

  REACTIONS.forEach(r => {
    const span = document.createElement("span");
    span.textContent = r;
    span.onclick = () => toggleReaction(messageId, r, currentReactions);
    popup.appendChild(span);
  });

  msgElement.appendChild(popup);

  setTimeout(() => popup.classList.add("show"), 10);

  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target)) {
      popup.remove();
    }
  }, { once: true });
}

setInterval(() => {
    const dot = document.querySelector(".online-dot");
    if (dot) dot.style.opacity = dot.style.opacity === "1" ? "0.4" : "1";
}, 1200);
