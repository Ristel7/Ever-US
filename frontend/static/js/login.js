console.log("LOGIN JS FILE LOADED");

document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM LOADED");

    const form = document.getElementById("loginForm");

    console.log("LOGIN FORM:", form);

    if (!form) {
        console.error("loginForm NOT FOUND");
        return;
    }

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        console.log("LOGIN BUTTON CLICKED");

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        console.log("EMAIL:", email);
        console.log("PASSWORD ENTERED:", password.length > 0);

        try {

            console.log("CALLING API...");

            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            console.log("API STATUS:", response.status);

            const result = await response.json();

            console.log("API RESPONSE:", result);

            if (!response.ok || !result.success) {

                alert(
                    result.message ||
                    "Login failed"
                );

                return;
            }

            localStorage.setItem(
                "access_token",
                result.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(result.user)
            );

            alert("LOGIN SUCCESSFUL");

        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            alert(
                "Could not connect to server"
            );

        }

    });

});