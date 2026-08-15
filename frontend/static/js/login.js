document.addEventListener("DOMContentLoaded", () => {

    console.log("everUS Login JS loaded");


    // =====================================================
    // ELEMENTS
    // =====================================================

    const loginForm =
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


    // =====================================================
    // CHECK LOGIN FORM
    // =====================================================

    if (!loginForm) {

        console.error(
            "Login form #loginForm was not found."
        );

        return;
    }


    // =====================================================
    // CHECK IF ALREADY LOGGED IN
    // =====================================================

    const existingToken =
        localStorage.getItem("access_token");


    if (existingToken) {

        console.log(
            "Existing authentication token found."
        );

        // Don't automatically redirect for now.
        // This makes testing easier.

    }


    // =====================================================
    // PASSWORD SHOW / HIDE
    // =====================================================

    if (
        passwordToggle &&
        passwordInput
    ) {

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


        message.textContent =
            text;


        message.className =
            "form-message";


        if (type) {

            message.classList.add(
                type
            );

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


            // =================================================
            // GET FORM VALUES
            // =================================================

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            // =================================================
            // CLEAR MESSAGE
            // =================================================

            showMessage("");


            // =================================================
            // VALIDATION
            // =================================================

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


            // =================================================
            // LOADING STATE
            // =================================================

            const originalButtonHTML =
                loginButton.innerHTML;


            loginButton.disabled =
                true;


            loginButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
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


                // =================================================
                // READ RESPONSE SAFELY
                // =================================================

                let result;


                try {

                    result =
                        await response.json();

                } catch (jsonError) {

                    console.error(
                        "Invalid JSON response:",
                        jsonError
                    );


                    showMessage(
                        "The server returned an invalid response.",
                        "error"
                    );

                    return;
                }


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

                    console.warn(
                        "Login failed:",
                        result.message
                    );

                    return;
                }


                // =================================================
                // CHECK JWT TOKEN
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
                // SAVE JWT
                // =================================================

                localStorage.setItem(
                    "access_token",
                    result.token
                );


                console.log(
                    "JWT token saved successfully."
                );


                // =================================================
                // SAVE USER
                // =================================================

                if (result.user) {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(
                            result.user
                        )
                    );


                    console.log(
                        "User data saved:",
                        result.user
                    );

                }


                // =================================================
                // SAVE LOGIN STATE
                // =================================================

                localStorage.setItem(
                    "is_logged_in",
                    "true"
                );


                // =================================================
                // SUCCESS
                // =================================================

                showMessage(
                    "Login successful! Opening your dashboard...",
                    "success"
                );


                console.log(
                    "Authentication completed successfully."
                );


                // =================================================
                // REDIRECT
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
                    "Login request failed:",
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