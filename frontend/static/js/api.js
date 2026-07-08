const API_URL = "http://127.0.0.1:5000/api";

async function api(endpoint, method = "GET", data = null) {

    const token = localStorage.getItem("token");

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