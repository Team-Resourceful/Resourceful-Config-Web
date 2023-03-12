const code = localStorage.getItem("code");
const logoutButton = document.getElementById('logout');

if (code) {
    if (logoutButton) {
        logoutButton.addEventListener('click', () => revoke());
    }
} else {
    location.href = '/';
}