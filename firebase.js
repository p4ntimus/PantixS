// Firebase CDN laden
document.write('<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"><\/script>');
document.write('<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"><\/script>');
document.write('<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"><\/script>');

// Firebase Config
var firebaseConfig = {
  apiKey: "AIzaSyC-hBSCx7SICKQ7ntYFcJIwgR5zsewj8hg",
  authDomain: "pantixs.firebaseapp.com",
  projectId: "pantixs",
  storageBucket: "pantixs.firebasestorage.app",
  messagingSenderId: "397472052167",
  appId: "1:397472052167:web:b769b80410f86711cd9fe2",
  measurementId: "G-2VR1G8JN1B"
};

// Initialisieren
setTimeout(() => {
    firebase.initializeApp(firebaseConfig);
    window.auth = firebase.auth();
    window.db = firebase.firestore();
}, 200);
