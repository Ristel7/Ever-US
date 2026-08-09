document.addEventListener("DOMContentLoaded", () => {

    const token =
        localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "/login";
        return;
    }


    const form =
        document.getElementById("createSpaceForm");

    const nameInput =
        document.getElementById("spaceName");

    const descriptionInput =
        document.getElementById("description");

    const coverInput =
        document.getElementById("coverImage");

    const coverPreview =
        document.getElementById("coverPreview");

    const message =
        document.getElementById("formMessage");

    const button =
        document.getElementById("createButton");


    // =====================================================
    // COVER PREVIEW
    // =====================================================

    coverInput.addEventListener(
        "change",
        () => {

            const file =
                coverInput.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {

                message.textContent =
                    "Please select a valid image.";

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                (event) => {

                    coverPreview.style.backgroundImage =
                        `url("${event.target.result}")`;

                    coverPreview.classList.add(
                        "has-image"
                    );

                    coverPreview.innerHTML = `
                        <strong>
                            Change cover image
                        </strong>
                    `;

                };


            reader.readAsDataURL(file);

        }
    );


    // =====================================================
    // CREATE SPACE
    // =====================================================

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const spaceName =
                nameInput.value.trim();

            const selectedType =
                document.querySelector(
                    'input[name="space_type"]:checked'
                );

            const spaceType =
                selectedType
                    ? selectedType.value
                    : "";

            const description =
                descriptionInput.value.trim();


            message.textContent = "";
            message.className = "form-message";


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (!spaceName) {

                message.textContent =
                    "Please enter a space name.";

                nameInput.focus();

                return;
            }


            if (!spaceType) {

                message.textContent =
                    "Please choose what this space is for.";

                return;
            }


            // -------------------------------------------------
            // LOADING
            // -------------------------------------------------

            button.disabled = true;

            button.innerHTML = `
                <span>Creating...</span>
                <i class="fa-solid fa-spinner fa-spin"></i>
            `;


            try {

                // =================================================
                // CREATE SPACE
                // =================================================

                const response =
                    await fetch(
                        "/api/spaces",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                space_name:
                                    spaceName,

                                space_type:
                                    spaceType,

                                description:
                                    description

                            })
                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Create space:",
                    result
                );


                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        "Unable to create space."
                    );

                }


                // =================================================
                // SUCCESS
                // =================================================

                message.className =
                    "form-message success";


                message.textContent =
                    "Space created successfully!";


                setTimeout(
                    () => {

                        window.location.href =
                            "/dashboard";

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Create space error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Something went wrong.";


            } finally {

                button.disabled =
                    false;

                button.innerHTML = `
                    <span>Create Space</span>
                    <i class="fa-solid fa-arrow-right"></i>
                `;

            }

        }
    );

});