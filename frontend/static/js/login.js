document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const passwordToggle = document.getElementById("passwordToggle");
    const message = document.getElementById("formMessage");
    const loginButton = document.getElementById("loginButton");


    /* =====================================================
       SHOW / HIDE PASSWORD
    ===================================================== */

    passwordToggle.addEventListener("click", () => {

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";

        passwordToggle.textContent =
            isPassword ? "Hide" : "Show";

    });


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(text, type) {

        message.textContent = text;

        message.className =
            "form-message " + type;
    }


    /* =====================================================
       LOGIN
    ===================================================== */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        /* ---------------------------------------------
           VALIDATION
        --------------------------------------------- */

        if (!email) {

            showMessage(
                "Please enter your email address.",
                "error"
            );

            emailInput.focus();

            return;
        }


        if (!password) {

            showMessage(
                "Please enter your password.",
                "error"
            );

            passwordInput.focus();

            return;
        }


        /* ---------------------------------------------
           LOADING STATE
        --------------------------------------------- */

        loginButton.disabled = true;

        const originalButton =
            loginButton.innerHTML;

        loginButton.innerHTML = `
            <span>Signing in...</span>
        `;


        showMessage("", "");


        try {

            /* -----------------------------------------
               CALL LOGIN API
            ----------------------------------------- */

            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const result =
                await response.json();


            console.log(
                "Login response:",
                result
            );


            /* -----------------------------------------
               API ERROR
            ----------------------------------------- */

            if (!response.ok || !result.success) {

                showMessage(
                    result.message ||
                    "Invalid email or password.",
                    "error"
                );

                return;
            }


            /* -----------------------------------------
               SAVE JWT
            ----------------------------------------- */

            localStorage.setItem(
                "access_token",
                result.token
            );


            /* -----------------------------------------
               SAVE USER
            ----------------------------------------- */

            localStorage.setItem(
                "user",
                JSON.stringify(result.user)
            );


            /* -----------------------------------------
               SUCCESS
            ----------------------------------------- */

            showMessage(
                "Login successful. Redirecting...",
                "success"
            );


            /* -----------------------------------------
               REDIRECT
            ----------------------------------------- */

            setTimeout(() => {

                window.location.href =
                    "/dashboard";

            }, 800);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            showMessage(
                "Unable to connect to the server. Please try again.",
                "error"
            );


        } finally {

            loginButton.disabled = false;

            loginButton.innerHTML =
                originalButton;

        }

    });

});