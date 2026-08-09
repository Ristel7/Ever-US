document.addEventListener("DOMContentLoaded", () => {

    console.log("everUS Login JS loaded");


    // =====================================================
    // ELEMENTS
    // =====================================================

    const loginForm = document.getElementById("loginForm");

    const emailInput = document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const message =
        document.getElementById("formMessage");

    const loginButton =
        document.getElementById("loginButton");


    // =====================================================
    // CHECK FORM
    // =====================================================

    if (!loginForm) {

        console.error(
            "Login form #loginForm was not found."
        );

        return;
    }


    // =====================================================
    // PASSWORD SHOW / HIDE
    // =====================================================

    if (passwordToggle) {

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

    }


    // =====================================================
    // MESSAGE FUNCTION
    // =====================================================

    function showMessage(
        text,
        type = ""
    ) {

        if (!message) {
            return;
        }

        message.textContent = text;

        message.className =
            "form-message";

        if (type) {
            message.classList.add(type);
        }

    }


    // =====================================================
    // LOGIN FORM
    // =====================================================

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            console.log(
                "Login form submitted"
            );


            // -------------------------------------------------
            // GET VALUES
            // -------------------------------------------------

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            // -------------------------------------------------
            // CLEAR OLD MESSAGE
            // -------------------------------------------------

            showMessage("");


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
            // LOADING STATE
            // -------------------------------------------------

            const originalButtonHTML =
                loginButton.innerHTML;


            loginButton.disabled = true;


            loginButton.innerHTML = `
                <span>Signing in...</span>
            `;


            try {

                console.log(
                    "Sending login request..."
                );


                // =================================================
                // LOGIN API
                // =================================================

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
                    "Login API status:",
                    response.status
                );


                // -------------------------------------------------
                // READ RESPONSE
                // -------------------------------------------------

                const result =
                    await response.json();


                console.log(
                    "Login API response:",
                    result
                );


                // =================================================
                // LOGIN FAILED
                // =================================================

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


                // =================================================
                // CHECK TOKEN
                // =================================================

                if (!result.token) {

                    console.error(
                        "Login successful but no token was returned."
                    );

                    showMessage(
                        "Login failed: authentication token was not received.",
                        "error"
                    );

                    return;
                }


                // =================================================
                // SAVE JWT TOKEN
                // =================================================

                localStorage.setItem(
                    "access_token",
                    result.token
                );


                // =================================================
                // SAVE USER DATA
                // =================================================

                if (result.user) {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(
                            result.user
                        )
                    );

                }


                console.log(
                    "JWT token saved successfully"
                );


                console.log(
                    "User:",
                    result.user
                );


                // =================================================
                // SUCCESS MESSAGE
                // =================================================

                showMessage(
                    "Login successful! Opening your dashboard...",
                    "success"
                );


                // =================================================
                // REDIRECT TO DASHBOARD
                // =================================================

                setTimeout(
                    () => {

                        window.location.href =
                            "/dashboard";

                    },
                    700
                );

            }


            // =====================================================
            // NETWORK / SERVER ERROR
            // =====================================================

            catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                showMessage(
                    "Unable to connect to the server. Please try again.",
                    "error"
                );

            }


            // =====================================================
            // RESTORE BUTTON
            // =====================================================

            finally {

                loginButton.disabled =
                    false;


                loginButton.innerHTML =
                    originalButtonHTML;

            }

        }
    );

});