const iconsContainer = document.getElementById("icons");
const selectedIcon = document.getElementById("selected-icon");
const iconTitle = document.getElementById("icon-title");
const iconId = document.querySelector("#icon-id > code");
const iconProvider = document.getElementById("icon-provider");
const copyButton = document.getElementById("copy");
const searchBar = document.getElementById("search-input");
const searchlabel = document.getElementById("search-label");

for (let icon of allowedIcons) {
    const title = fullyCapitalize(icon.replaceAll("-", " "));
    const element = createImgIcon(icon, title);
    element.classList.add("icon");
    element.dataset.icon = icon;
    element.title = title;

    let iconUrl = "https://lucide.dev";
    let iconAuthor = "lucide.dev";

    if (iconAuthors[icon]) {
        iconUrl = iconAuthors[icon].link;
        iconAuthor = iconAuthors[icon].name;
    }

    element.addEventListener("click", () => {
        selectedIcon.src = element.src;
        iconTitle.textContent = title;
        iconId.textContent = icon;
        iconProvider.href = iconUrl;
        iconProvider.textContent = iconAuthor;
    });

    iconsContainer.appendChild(element);
}

searchlabel.innerText = `${allowedIcons.size}/${allowedIcons.size} Icons`;

copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(iconId.textContent);
});

runOnInputOrChange(searchBar, () => {
    const search = searchBar.value.toLowerCase();
    console.log(search)
    for (let element of iconsContainer.children) {
        if (element.dataset.icon.includes(search)) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    }
    const amount = iconsContainer.children.length - Array.from(iconsContainer.children).filter(e => e.style.display === "none").length;
    searchlabel.innerText = `${amount}/${allowedIcons.size} Icons`;
});