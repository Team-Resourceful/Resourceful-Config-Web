const baseUrl = `${location.protocol}//${location.host}`;
const revokeUrl = `${baseUrl}/api/v1/private/revoke`;
const loginUrl = `${baseUrl}/api/v1/public/mslogin`;

function revoke() {
    const code = localStorage.getItem("code");
    if (!code) return;
    fetch(revokeUrl, {
        method: "DELETE",
        headers: {
            "Authorization": `bearer ${code}`
        }
    }).then(() => {
        localStorage.removeItem("code");
        location.href = '/';
    });
}

function login(code, password, errorCallback) {
    fetch(`${loginUrl}?svr_pw=${password}`, {
        headers: {
            "Authorization": `Microsoft ${code}`
        }
    })
        .then((response) => {
            if (response.status === 200) {
                response.json()
                    .then(json => {
                        localStorage.setItem("code", json.token);
                    })
                    .then(() => window.location.replace(`${baseUrl}/configs`))
                    .catch(() => {
                        errorCallback("Failed to parse response from server.<br>Please try again.");
                    });
            } else {
                errorCallback(`Error while logging in.<br>Error code: ${response.status}`);
            }
        })
        .catch(() => {
            errorCallback("Could not connect to server.<br>Please try again later.");
        })
}

function postConfigServer(path, data, callback) {
    const jwt = localStorage.getItem("code");
    const server = localStorage.getItem("last-server-domain");
    if (!jwt) {
        callback("No token found", null);
        return;
    }
    if (!server) {
        callback("No server domain found", null);
        return;
    }

    fetch(createLocalAwareUrl(server, path), {
        method: "POST",
        body: data,
        headers: {
            "Authorization": `bearer ${jwt}`
        }
    }).then((response) => {
        if (response.status === 200) {
            callback(null, response);
        } else if (response.status === 401) {
            callback("Unauthorized", null);
        } else if (response.status === 400) {
            callback("Bad Request, error maybe have occurred, please try again layer.", null);
        }else {
            callback("An error occurred while connecting to the server, please try again later.", null);
        }
    }).catch((error) => {
        callback("An error occurred while connecting to the server, please try again later.", null);
        console.error(error);
    });
}

function callConfigServer(path, callback) {
    const jwt = localStorage.getItem("code");
    const server = localStorage.getItem("last-server-domain");
    if (!jwt) {
        callback("No token found", null);
        return;
    }
    if (!server) {
        callback("No server domain found", null);
        return;
    }

    fetch(createLocalAwareUrl(server, path), {
        method: "GET",
        headers: {
            "Authorization": `bearer ${jwt}`
        }
    }).then((response) => {
        if (response.status === 200) {
            callback(null, response);
        } else if (response.status === 401) {
            callback("Unauthorized", null);
        } else if (response.status === 400) {
            callback("Bad Request, error maybe have occurred, please try again layer.", null);
        }else {
            const isSafari = window.safari !== undefined;
            if (isSafari) {
                callback("An error occurred while connecting to the server, please try again later.<br>It may be that your browser is not supported.", null);
            } else {
                callback("An error occurred while connecting to the server, please try again later.", null);
            }
        }
    }).catch((error) => {
        const isSafari = window.safari !== undefined;
        if (isSafari) {
            callback("An error occurred while connecting to the server, please try again later.<br>It may be that your browser is not supported.", null);
        } else {
            callback("An error occurred while connecting to the server, please try again later.", null);
        }
        console.error(error);
    });
}

function createLocalAwareUrl(server, path) {
    const start = server.split(":")[0];
    if (start === "localhost" || start === "127.0.0.1") {
        // noinspection HttpUrlsUsage
        return `http://${server}/${path}`;
    }
    return `${location.protocol}//${server}/${path}`;
}