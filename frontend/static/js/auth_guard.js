async function verifyUser() {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "/login";
        return;

    }

    const response = await api("/users/profile");

    if (!response.success) {

        localStorage.removeItem("token");

        window.location.href = "/login";

    }

}