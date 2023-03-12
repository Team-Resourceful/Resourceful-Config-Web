function showErrorMessage(message) {
    document.getElementById("login-container").innerHTML = "";

    const text = document.createElement("p");
    text.innerHTML = message;

    document.getElementById("login-container").appendChild(text);

    const button = document.createElement("a");
    button.innerText = "Return to Login";
    button.href = "/";
    button.className = "btn";

    document.getElementById("login-container").appendChild(button);
}

const params = new URLSearchParams(location.search);
const password = localStorage.getItem("last-server-password");

if (params.get("code") && password) {
    login(params.get("code"), password, showErrorMessage);
} else {
    showErrorMessage("No code or password provided.<br>Try logging in again.");
}