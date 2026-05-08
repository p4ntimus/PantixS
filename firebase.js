<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>

<script>
  var firebaseConfig = {
    apiKey: "AIzaSyC-hBSCx7SICKQ7ntYFcJIwgR5zsewj8hg",
    authDomain: "pantixs.firebaseapp.com",
    projectId: "pantixs",
    storageBucket: "pantixs.firebasestorage.app",
    messagingSenderId: "397472052167",
    appId: "1:397472052167:web:b769b80410f86711cd9fe2",
    measurementId: "G-2VR1G8JN1B"
  };

  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  const db = firebase.firestore();
</script>
