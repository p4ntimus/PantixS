import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Deine Firebase Config einfügen
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const messagesRef = collection(db, "messages");

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Username laden oder Overlay anzeigen
let username = localStorage.getItem("pantinet_username");

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

  localStorage.setItem("pantinet_username", name);
  username = name;
  overlay.style.display = "none";
};

// ⭐ Zeitformat-Funktion
function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Nachricht senden
sendBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text || !username) return;

  await addDoc(messagesRef, {
    text,
    user: username,
    createdAt: serverTimestamp()
  });

  input.value = "";
};

// Nachrichten live empfangen
const q = query(messagesRef, orderBy("createdAt"));

onSnapshot(q, (snapshot) => {
  messagesDiv.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();

    const msg = document.createElement("div");
    msg.className = "message";

    msg.innerHTML = `
      <div class="msg-header">
        <strong>${data.user || "Unbekannt"}</strong>
        <span class="msg-time">${formatTime(data.createdAt)}</span>
      </div>
      <div class="msg-text">${data.text}</div>
    `;

    messagesDiv.appendChild(msg);
  });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
