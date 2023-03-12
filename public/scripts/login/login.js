document.getElementById("show-password").addEventListener("click", () => {
    const passwordInput = document.getElementById("server-password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        document.getElementById("show-password").classList.add("open")
    } else {
        document.getElementById("show-password").classList.remove("open")
        passwordInput.type = "password";
    }
});

const urlSearchParams = new URLSearchParams(window.location.search);

const password = urlSearchParams.get("password");
const server = urlSearchParams.get("server");

if (!password && !server) {
    const localPassword = localStorage.getItem("last-server-password");
    const localServer = localStorage.getItem("last-server-domain");
    if (localPassword && localServer) {
        document.getElementById("server-password").value = localPassword;
        document.getElementById("server-domain").value = localServer;
    }
} else {
    if (server) {
        document.getElementById("server-domain").value = server;
    }
    if (password) {
        document.getElementById("server-password").value = password;
    }
}

const clientId = "7ed5b425-d3f5-4f1d-8985-7927545d195b"
const baseUrl = `${location.protocol}//${location.host}`;
const loginUrl = encodeURIComponent(`${baseUrl}/mslogin`);
console.log("Login URL: " + loginUrl);
const redirectUrl = `https://login.live.com/oauth20_authorize.srf?client_id=${clientId}&response_type=code&redirect_uri=${loginUrl}&scope=XboxLive.signin%20offline_access`;

document.getElementById("server-login").addEventListener("click", () => {
    const password = document.getElementById("server-password").value;
    const domain = document.getElementById("server-domain").value;

    if (domain && password) {
        localStorage.setItem("last-server-password", password)
        localStorage.setItem("last-server-domain", domain)
        location.assign(redirectUrl);
    }
})

