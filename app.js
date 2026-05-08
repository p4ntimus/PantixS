const nameInput = document.getElementById("nameInput");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    if (!name) {
        alert("Bitte Namen eingeben");
        return;
    }

    try {
        const cred = await auth.signInAnonymously();
        await cred.user.updateProfile({ displayName: name });

        window.location.href = "chat.html";
    } catch (err) {
        console.error(err);
        alert("Login fehlgeschlagen");
    }
});
