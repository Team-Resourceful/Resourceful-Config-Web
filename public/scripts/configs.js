
function loadConfig(config) {
    const container = document.getElementById("configs");
    const entry = document.createElement("div");
    entry.classList.add("config-file");

    const header = document.createElement("div");
    header.classList.add("heading");
    if (config.color instanceof Object) {
        const degree = config.color.degree ?? "45deg";
        const first = config.color.first ?? "#000000";
        const second = config.color.second ?? "#ffffff";
        header.style.background = `linear-gradient(${degree}, ${first}, ${second})`;
    } else {
        header.style.backgroundColor = config.color;
    }

    const editBar = document.createElement("div");
    editBar.classList.add("edit-bar");

    const buttonBar = document.createElement("div");
    buttonBar.classList.add("button-bar");

    for (let link of config.links.slice(-3)) {
        const linkbtn = createIcon(link.icon, link.url, true, link.title);
        linkbtn.classList.add("config-button");
        linkbtn.classList.add("link-button");
        buttonBar.appendChild(linkbtn);
    }

    const edit = createIcon("edit", document.location.origin + `/config?id=${config.id}`);
    edit.classList.add("config-button");
    editBar.appendChild(edit);

    header.appendChild(editBar);
    header.appendChild(buttonBar);

    const info = document.createElement("div");
    info.classList.add("info");

    const text = document.createElement("div");

    const title = document.createElement("h1");
    title.innerText = config.title;

    const description = document.createElement("p");
    description.innerText = config.description;

    text.appendChild(title);
    text.appendChild(description);

    info.appendChild(createImgIcon(config.icon));
    info.appendChild(text);

    entry.appendChild(header);
    entry.appendChild(info);

    container.appendChild(entry);
}

callConfigServer("configs", (error, response) => {
    if (error) {
        const container = document.getElementById("configs");
        container.innerHTML = "";
        container.innerText = error;
        return;
    }
    response.json().then((json) => {
        const container = document.getElementById("configs");
        container.classList.remove("loading");
        container.innerHTML = "";
        json.forEach((config) => {
            loadConfig(config);
        });
    });
});