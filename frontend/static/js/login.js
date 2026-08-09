console.log("LOGIN JS FILE LOADED");


document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM LOADED");


    const form =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const message =
        document.getElementById("formMessage");

    const loginButton =
        document.getElementById("loginButton");


    console.log(
        "LOGIN FORM:",
        form
    );


    // =====================================================
    // PASSWORD TOGGLE
    // =====================================================

    passwordToggle.addEventListener(
        "click",
        () => {

            const isPassword =
                passwordInput.type === "password";


            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";


            passwordToggle.textContent =
                isPassword
                    ? "Hide"
                    : "Show";


            passwordToggle.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );

        }
    );


    // =====================================================
    // MESSAGE
    // =====================================================

    function showMessage(
        text,
        type = ""
    ) {

        message.textContent = text;

        message.className =
            "form-message " + type;

    }


    // =====================================================
    // LOGIN
    // =====================================================

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            console.log(
                "LOGIN BUTTON CLICKED"
            );


            const email =
                emailInput.value.trim();


            const password =
                passwordInput.value;


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

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


            if (password.length < 8) {

                showMessage(
                    "Password must contain at least 8 characters.",
                    "error"
                );

                passwordInput.focus();

                return;

            }


            // -------------------------------------------------
            // LOADING
            // -------------------------------------------------

            const originalHTML =
                loginButton.innerHTML;


            loginButton.disabled = true;


            loginButton.innerHTML = `
                <span>Signing in...</span>
            `;


            showMessage("");


            try {

                console.log(
                    "CALLING LOGIN API..."
                );


                // -------------------------------------------------
                // API REQUEST
                // -------------------------------------------------

                const response =
                    await fetch(
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


                console.log(
                    "API STATUS:",
                    response.status
                );


                const result =
                    await response.json();


                console.log(
                    "API RESPONSE:",
                    result
                );


                // -------------------------------------------------
                // LOGIN FAILED
                // -------------------------------------------------

                if (
                    !response.ok ||
                    !result.success
                ) {

                    showMessage(
                        result.message ||
                        "Invalid email or password.",
                        "error"
                    );

                    return;

                }


                // -------------------------------------------------
                // SAVE JWT
                // -------------------------------------------------

                localStorage.setItem(
                    "access_token",
                    result.token
                );


                // -------------------------------------------------
                // SAVE USER
                // -------------------------------------------------

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        result.user
                    )
                );


                // -------------------------------------------------
                // SUCCESS
                // -------------------------------------------------

                showMessage(
                    "Login successful! Redirecting...",
                    "success"
                );


                console.log(
                    "LOGIN SUCCESSFUL"
                );


                // -------------------------------------------------
                // TEMPORARY REDIRECT
                // -------------------------------------------------

                setTimeout(
                    () => {

                        window.location.href =
                            "/";

                    },
                    800
                );

            }


            catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                showMessage(
                    "Unable to connect to the server. Please try again.",
                    "error"
                );

            }


            finally {

                loginButton.disabled =
                    false;


                loginButton.innerHTML =
                    originalHTML;

            }

        }
    );

}); 