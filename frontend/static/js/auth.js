async function login(email, password) {

    const response = await api(
        "/auth/login",
        "POST",
        {
            email,
            password
        }
    );

    if (response.success) {

        localStorage.setItem(
            "access_token",
            response.token
        );

        window.location.href = "/dashboard";

    } else {

        alert(response.message);

    }

}
