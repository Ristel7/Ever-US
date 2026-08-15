document.addEventListener("DOMContentLoaded", () => {


    // =====================================================
    // ELEMENTS
    // =====================================================

    const sidebar =
        document.getElementById("settingsSidebar");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const menuItems =
        document.querySelectorAll(
            ".settings-menu-item"
        );

    const sections =
        document.querySelectorAll(
            ".settings-section"
        );


    const generalForm =
        document.getElementById("generalForm");

    const spaceName =
        document.getElementById("spaceName");

    const spaceDescription =
        document.getElementById(
            "spaceDescription"
        );

    const descriptionCounter =
        document.getElementById(
            "descriptionCounter"
        );

    const resetGeneral =
        document.getElementById(
            "resetGeneral"
        );


    const savePrivacy =
        document.getElementById(
            "savePrivacy"
        );


    const saveNotifications =
        document.getElementById(
            "saveNotifications"
        );


    const changeSpaceIcon =
        document.getElementById(
            "changeSpaceIcon"
        );


    const leaveSpace =
        document.getElementById(
            "leaveSpace"
        );


    const deleteSpace =
        document.getElementById(
            "deleteSpace"
        );


    const confirmModal =
        document.getElementById(
            "confirmModal"
        );


    const confirmTitle =
        document.getElementById(
            "confirmTitle"
        );


    const confirmMessage =
        document.getElementById(
            "confirmMessage"
        );


    const confirmCancel =
        document.getElementById(
            "confirmCancel"
        );


    const confirmAction =
        document.getElementById(
            "confirmAction"
        );


    let confirmCallback = null;


    // =====================================================
    // MOBILE SIDEBAR
    // =====================================================

    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "open"
                );

            }
        );

    }


    // =====================================================
    // SETTINGS NAVIGATION
    // =====================================================

    menuItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    const sectionName =
                        item.dataset.section;


                    menuItems.forEach(
                        menuItem => {

                            menuItem.classList.remove(
                                "active"
                            );

                        }
                    );


                    sections.forEach(
                        section => {

                            section.classList.remove(
                                "active"
                            );

                        }
                    );


                    item.classList.add(
                        "active"
                    );


                    const selectedSection =
                        document.getElementById(
                            sectionName
                        );


                    if (selectedSection) {

                        selectedSection.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );


    // =====================================================
    // DESCRIPTION COUNTER
    // =====================================================

    function updateDescriptionCounter() {

        const length =
            spaceDescription.value.length;


        descriptionCounter.textContent =
            `${length} / 300 characters`;

    }


    spaceDescription.addEventListener(
        "input",
        updateDescriptionCounter
    );


    updateDescriptionCounter();


    // =====================================================
    // GENERAL FORM
    // =====================================================

    generalForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const button =
                generalForm.querySelector(
                    ".save-button"
                );


            button.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Saving...
            `;


            button.disabled = true;


            /*
             * API connection will be added later.
             *
             * Example future request:
             *
             * PUT /api/spaces/<space_id>
             */

            setTimeout(
                () => {

                    button.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Saved
                    `;


                    setTimeout(
                        () => {

                            button.innerHTML = `
                                <i class="fa-solid fa-check"></i>
                                Save Changes
                            `;

                            button.disabled =
                                false;

                        },
                        900
                    );

                },
                700
            );

        }
    );


    // =====================================================
    // RESET GENERAL
    // =====================================================

    resetGeneral.addEventListener(
        "click",
        () => {

            spaceName.value =
                "Priyanshu ❤️ Tanu";


            spaceDescription.value =
                "A private place for our memories, conversations and moments.";


            updateDescriptionCounter();

        }
    );


    // =====================================================
    // PRIVACY SAVE
    // =====================================================

    savePrivacy.addEventListener(
        "click",
        () => {

            saveButtonState(
                savePrivacy,
                "Save Privacy Settings"
            );

        }
    );


    // =====================================================
    // NOTIFICATION SAVE
    // =====================================================

    saveNotifications.addEventListener(
        "click",
        () => {

            saveButtonState(
                saveNotifications,
                "Save Notification Settings"
            );

        }
    );


    function saveButtonState(
        button,
        originalText
    ) {

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Saving...
        `;


        button.disabled = true;


        setTimeout(
            () => {

                button.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Saved
                `;


                setTimeout(
                    () => {

                        button.innerHTML = `
                            <i class="fa-solid fa-check"></i>
                            ${originalText}
                        `;


                        button.disabled =
                            false;

                    },
                    900
                );

            },
            700
        );

    }


    // =====================================================
    // CHANGE SPACE ICON
    // =====================================================

    changeSpaceIcon.addEventListener(
        "click",
        () => {

            alert(
                "Space icon upload will be connected later."
            );

        }
    );


    // =====================================================
    // CONFIRMATION MODAL
    // =====================================================

    function openConfirm(
        title,
        message,
        actionText,
        callback
    ) {

        confirmTitle.textContent =
            title;


        confirmMessage.textContent =
            message;


        confirmAction.textContent =
            actionText;


        confirmCallback =
            callback;


        confirmModal.classList.add(
            "open"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeConfirm() {

        confirmModal.classList.remove(
            "open"
        );


        document.body.style.overflow =
            "";


        confirmCallback =
            null;

    }


    confirmCancel.addEventListener(
        "click",
        closeConfirm
    );


    confirmAction.addEventListener(
        "click",
        () => {

            if (confirmCallback) {

                confirmCallback();

            }


            closeConfirm();

        }
    );


    confirmModal.addEventListener(
        "click",
        event => {

            if (
                event.target === confirmModal
            ) {

                closeConfirm();

            }

        }
    );


    // =====================================================
    // LEAVE SPACE
    // =====================================================

    leaveSpace.addEventListener(
        "click",
        () => {

            openConfirm(
                "Leave this space?",
                "You will lose access to this space and its content.",
                "Leave Space",
                () => {

                    /*
                     * Later:
                     *
                     * DELETE /api/spaces/<space_id>/members/me
                     */

                    alert(
                        "Leave space API will be connected next."
                    );

                }
            );

        }
    );


    // =====================================================
    // DELETE SPACE
    // =====================================================

    deleteSpace.addEventListener(
        "click",
        () => {

            openConfirm(
                "Delete this space?",
                "This will permanently delete the space, memories, messages and other content.",
                "Delete Space",
                () => {

                    /*
                     * Later:
                     *
                     * DELETE /api/spaces/<space_id>
                     */

                    alert(
                        "Delete space API will be connected next."
                    );

                }
            );

        }
    );


    // =====================================================
    // ESCAPE
    // =====================================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeConfirm();

            }

        }
    );

});