(function(){
    const displayName = document.getElementById("username");
    const icon = document.getElementById("user-icon-img");

    const code = localStorage.getItem("code");

    if (code) {
        const jwt = parseJwt(code);
        if (jwt) {
            displayName.innerText = jwt.name;
            icon.src = `https://crafthead.net/helm/${jwt.sub}`;
            return
        }
    }
    displayName.innerText = "Anonymous";
})();