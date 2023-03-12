const back = document.getElementById("back-btn");

let currentData = undefined;
let backButtonAction = () => {
    window.location.assign("/configs");
};

function loadNewPage(data) {
    if (currentData) {
        const currentPage = getQueryParam("page");
        const oldAction = backButtonAction;
        const oldData = currentData;
        backButtonAction = () => {
            loadPage(oldData, currentPage ?? "")
            setPageId(currentPage ?? "", true)
            backButtonAction = oldAction
        }
    }
    currentData = data;
    document.getElementById("selected-category").innerText = data.title;
}

function getPageId(id) {
    const page = getQueryParam("page");
    if (page) {
        return `${page};${id}`;
    }
    return id;
}

function setPageId(id, force) {
    const page = getQueryParam("page");
    if (force) {
        if (page || id) {
            setQueryParam("page", id)
        }
    } else if (id && page !== id) {
        setQueryParam("page", getPageId(id));
    }
}

function getEntryId(id, newPage) {
    const page = newPage === undefined ? getQueryParam("page") : (newPage ?? "");
    if (page) {
        return `${page}:${id}`;
    }
    return id;
}

back.addEventListener("click", () => {
    if (backButtonAction) {
        backButtonAction()
    }
});

setPageId("", true);

