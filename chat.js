const messagesDiv = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const text = msgInput.value.trim();
    if (!text) return;

    db.collection("messages").add({
        text: text,
        sender: auth.currentUser.displayName || "Unbekannt",
        timestamp: Date.now()
    });

    msgInput.value = "";
}

db.collection("messages")
  .orderBy("timestamp")
  .onSnapshot(snapshot => {
      messagesDiv.innerHTML = "";

      snapshot.forEach(doc => {
          const msg = doc.data();
          const div = document.createElement("div");

          div.classList.add("message");
          if (msg.sender === (auth.currentUser && auth.currentUser.displayName)) {
              div.classList.add("me");
          }

          div.textContent = msg.sender + ": " + msg.text;
          messagesDiv.appendChild(div);
      });

      messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
