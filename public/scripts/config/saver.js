const save = document.getElementById("save-btn");

save.addEventListener("click", () => {

    const sentData = JSON.stringify(Object.fromEntries(data.entries()), null, 4);
    const params = new URLSearchParams(window.location.search);
    const configId = params.get("id");
    if (configId) {
        postConfigServer("save?id=" + configId, sentData, (error, response) => {
            if (!error && response.status === 200) {
                data.clear();
            }
        });
    }
});

window.addEventListener("beforeunload", (event) => {
    if (data.size > 0) {
        event.preventDefault();
        event.returnValue = "Config not saved!";
        return "Config not saved!";
    }
});