const API_URL = "/api";

async function api(endpoint, method = "GET", data = null) {

    const token = localStorage.getItem("access_token");

    const options = {
        method,
        headers: {}
    };

    if (token) {
        options.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
    }

    const response = await fetch(
        API_URL + endpoint,
        options
    );

    return await response.json();
}
