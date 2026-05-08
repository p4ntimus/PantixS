import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Deine Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC-hBSCx7SICKQ7ntYFcJIwgR5zsewj8hg",
  authDomain: "pantixs.firebaseapp.com",
  projectId: "pantixs",
  storageBucket: "pantixs.firebasestorage.app",
  messagingSenderId: "397472052167",
  appId: "1:397472052167:web:b769b80410f86711cd9fe2",
  measurementId: "G-2VR1G8JN1B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const messagesRef = collection(db, "messages");

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Nachrichten senden
sendBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;

  await addDoc(messagesRef, {
    text,
    createdAt: serverTimestamp()
  });

  input.value = "";
};

// Nachrichten live empfangen
const q = query(messagesRef, orderBy("createdAt"));

onSnapshot(q, (snapshot) => {
  messagesDiv.innerHTML = "";
  snapshot.forEach((doc) => {
    const msg = document.createElement("div");
    msg.className = "message";
    msg.textContent = doc.data().text;
    messagesDiv.appendChild(msg);
  });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
