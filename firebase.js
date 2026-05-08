// Firebase v9 Modular SDK (funktioniert in modernen Web-Apps)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

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

// App initialisieren
const app = initializeApp(firebaseConfig);

// Module exportieren
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
