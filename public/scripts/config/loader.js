const data = new Map();

function loadElement(title, description, option) {
    const items = document.getElementById("items");
    const entry = document.createElement("div")
    entry.classList.add("config-entry")
    const textEntry = document.createElement("div")
    textEntry.classList.add("config-entry-desc")
    const titleEntry = document.createElement("h3")
    titleEntry.innerText = title;
    const descriptionEntry = document.createElement("p")
    descriptionEntry.innerText = description;
    textEntry.appendChild(titleEntry)
    textEntry.appendChild(descriptionEntry)
    entry.appendChild(textEntry)
    entry.appendChild(option)
    items.appendChild(entry)
}

function createElement(elements, onReset) {
    const container = document.createElement("div")
    container.classList.add("config-entry-value")
    elements.forEach(element => {
        container.appendChild(element)
    });
    const resetButton = document.createElement("div")
    resetButton.classList.add("config-reset")
    resetButton.addEventListener("click", () => {
        if (onReset) {
            onReset()
        }
    });
    container.appendChild(resetButton)
    return container
}

function createToggleSwitch(id, current, defaultValue) {
    const switchLabel = document.createElement("label")
    switchLabel.classList.add("config-switch")
    const switchInput = document.createElement("input")
    switchInput.type = "checkbox"
    switchInput.name = id
    switchInput.id = id
    switchInput.checked = current
    const switchLabel2 = document.createElement("label")
    switchLabel2.htmlFor = id
    switchLabel2.dataset.on = "On"
    switchLabel2.dataset.off = "Off"
    switchLabel2.classList.add("switch-inner")
    switchLabel.appendChild(switchInput)
    switchLabel.appendChild(switchLabel2)

    runOnInputOrChange(switchInput, () => {
        data.set(getEntryId(id), switchInput.checked)
    });

    return createElement([switchLabel], () => {
        switchInput.checked = defaultValue
        data.set(getEntryId(id), defaultValue)
    });
}

function createSmallTextbox(id, current, defaultValue) {
    const textboxLabel = document.createElement("label")
    textboxLabel.classList.add("config-text")
    const textboxInput = document.createElement("input")
    textboxInput.type = "text"
    textboxInput.name = id
    textboxInput.id = id
    textboxInput.value = current
    textboxLabel.appendChild(textboxInput)

    runOnInputOrChange(textboxInput, () => {
        data.set(getEntryId(id), textboxInput.value)
    });

    return createElement([textboxLabel], () => {
        textboxInput.value = defaultValue
        data.set(getEntryId(id), defaultValue)
    });
}

function createLargeTextbox(id, current, defaultValue) {
    const textboxLabel = document.createElement("label")
    textboxLabel.classList.add("config-big-text")
    const textboxInput = document.createElement("textarea")
    textboxInput.name = id
    textboxInput.id = id
    textboxInput.value = current
    textboxInput.spellcheck = false
    textboxLabel.appendChild(textboxInput)

    runOnInputOrChange(textboxInput, () => {
        data.set(getEntryId(id), textboxInput.value)
    });

    return createElement([textboxLabel], () => {
        textboxInput.value = defaultValue
        data.set(getEntryId(id), defaultValue)
    });
}

function createRange(id, current, defaultValue, min, max, step) {
    const rangeLabel = document.createElement("label")
    rangeLabel.classList.add("config-slider")

    const minSpan = document.createElement("span")
    minSpan.classList.add("range-label")
    minSpan.innerText = min
    minSpan.id = id + "-min"

    const maxSpan = document.createElement("span")
    maxSpan.classList.add("range-label")
    maxSpan.innerText = max
    maxSpan.id = id + "-max"

    const rangeInput = document.createElement("input")
    rangeInput.type = "range"
    rangeInput.name = id
    rangeInput.id = id
    rangeInput.min = min
    rangeInput.max = max
    rangeInput.step = step
    rangeInput.value = current

    rangeLabel.appendChild(minSpan)
    rangeLabel.appendChild(rangeInput)
    rangeLabel.appendChild(maxSpan)

    const rangeValue = document.createElement("label")
    rangeValue.classList.add("config-slider-value")

    const rangeValueInput = document.createElement("input")
    rangeValueInput.type = "number"
    rangeValueInput.name = id + "-value"
    rangeValueInput.id = id + "-value"
    rangeValueInput.min = min
    rangeValueInput.max = max
    rangeValueInput.step = step
    rangeValueInput.value = current

    rangeValue.appendChild(rangeValueInput)

    runOnInputOrChange(rangeInput, () => {
        rangeValueInput.value = rangeInput.value
        data.set(getEntryId(id), Number.parseInt(rangeInput.value))
    });
    runOnInputOrChange(rangeValueInput, () => {
        rangeInput.value = rangeValueInput.value
        data.set(getEntryId(id), Number.parseInt(rangeValueInput.value))
    });

    return createElement([rangeLabel, rangeValue], () => {
        rangeInput.value = defaultValue
        rangeValueInput.value = defaultValue
        data.set(getEntryId(id), Number.parseInt(defaultValue))
    });
}

function createNumberInput(id, current, defaultValue, decimals) {
    const textboxLabel = document.createElement("label")
    textboxLabel.classList.add("config-number")
    const textboxInput = document.createElement("input")
    textboxInput.type = "number"
    textboxInput.name = id
    textboxInput.id = id
    textboxInput.value = decimals ? current.toFixed(2) : current
    textboxInput.step = decimals ? "0.1" : "1"
    textboxLabel.appendChild(textboxInput)

    textboxInput.addEventListener("keypress", (evt) => {
        const charCode = (evt.which) ? evt.which : evt.keyCode;
        const val = evt.currentTarget.value;
        const canUseDecimal = decimals && charCode === 46 && !val.includes(".") && val.length > 0;

        const valid = !(charCode > 31 && (charCode < 48 || charCode > 57)) || canUseDecimal;
        evt.returnValue = valid;
        return valid;
    });

    runOnInputOrChange(textboxInput, () => {
        if (textboxInput.value.endsWith(".")) {
            textboxInput.value = textboxInput.value.substr(0, textboxInput.value.length - 1)
        }

        if (Number.isNaN(Number.parseFloat(textboxInput.value))) {
            textboxInput.value = current
        }

        if (decimals) {
            textboxInput.value = Number.parseFloat(textboxInput.value).toFixed(2)
        }

        const float = Number.parseFloat(textboxInput.value);
        const int = Number.parseInt(textboxInput.value);
        if (textboxInput.value !== "") {
            data.set(getEntryId(id), decimals ? float : int)
        }
    });

    return createElement([textboxLabel], () => {
        const num = decimals ? defaultValue.toFixed(2) : defaultValue
        textboxInput.value = `${num}`
        data.set(getEntryId(id), Number.parseInt(num))
    });
}

function createDropdown(id, current, defaultValue, options) {
    const dropdown = document.createElement("label")
    dropdown.classList.add("config-dropdown")
    const dropdownSelect = document.createElement("select")
    dropdownSelect.name = id
    dropdownSelect.id = id
    options.forEach(option => {
        const dropdownOption = document.createElement("option")
        dropdownOption.value = option
        dropdownOption.innerText = option
        dropdownSelect.appendChild(dropdownOption)
    });
    dropdownSelect.value = current
    dropdown.appendChild(dropdownSelect)

    runOnInputOrChange(dropdownSelect, () => {
        data.set(getEntryId(id), dropdownSelect.value)
    });

    return createElement([dropdown], () => {
        dropdownSelect.value = defaultValue
        data.set(getEntryId(id), defaultValue)
    });
}

function loadEntries(entries, pageid) {
    const items = document.getElementById("items");
    items.innerHTML = ""
    for (let entry of entries) {
        let element;

        const key = getEntryId(entry.id, pageid)
        const current = data.has(key) ? data.get(key) : entry.current

        switch (entry.type) {
            case "toggle":
                element = createToggleSwitch(entry.id, current, entry.default)
                break;
            case "small-textbox":
                element = createSmallTextbox(entry.id, current, entry.default)
                break;
            case "large-textbox":
                element = createLargeTextbox(entry.id, current, entry.default)
                break;
            case "number":
                element = createNumberInput(entry.id, current, entry.default, entry.decimals)
                break;
            case "range":
                element = createRange(entry.id, current, entry.default, entry.min, entry.max, entry.step)
                break;
            case "dropdown":
                element = createDropdown(entry.id, current, entry.default, entry.options)
                break;
        }
        loadElement(entry.title, entry.description, element)
    }
}

function loadCategory(category) {
    const items = document.getElementById("category-list");
    const entry = document.createElement("li")
    const text = document.createElement("span")
    text.innerText = category.title
    entry.appendChild(text)
    entry.addEventListener("click", () => {
        loadPage(category, getPageId(category.id))
        setPageId(category.id)
    });
    items.appendChild(entry)
}

function loadCategories(categories) {
    const items = document.getElementById("category-list");
    items.innerHTML = ""
    categories?.forEach(category => {
        loadCategory(category)
    });
}

function loadPage(data, pageid) {
    loadNewPage(data)
    loadEntries(data.entries, pageid)
    loadCategories(data.categories)

    const image = getImgIconUrl(data.icon);
    const icon = document.getElementById("selected-category");
    icon.style.setProperty("--selected-category-image", `url(${image})`);
}

function loadConfig(data) {
    loadPage(data, "")
    document.getElementById("config-title").innerText = data.title
    document.getElementById("config-description").innerText = data.description
    const buttons = document.getElementById("entry-info-buttons");
    buttons.innerHTML = "";
    data.links.forEach(link => buttons.appendChild(createIcon(link.icon, link.url, true, link.title)));
}

const params = new URLSearchParams(window.location.search);
const configId = params.get("id");
if (configId) {
    callConfigServer(`config?id=${configId}`, (error, response) => {
        if (error) {
            document.getElementById("items").innerText = error;
        } else {
            response.json().then((json) => {
                try {
                    loadConfig(json);
                    document.getElementById("items").classList.remove("loading");
                } catch (e) {
                    document.getElementById("items").innerText = "Failed to load config";
                }
            }).catch(() => {
                document.getElementById("items").innerText = "Failed to load json config";
            })
        }
    });
}