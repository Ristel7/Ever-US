document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const navItems =
        document.querySelectorAll(
            ".space-nav-item"
        );

    const contentTabs =
        document.querySelectorAll(
            ".content-tab"
        );

    const contentViews =
        document.querySelectorAll(
            ".content-view"
        );

    const openTabButtons =
        document.querySelectorAll(
            "[data-open-tab]"
        );


    // =====================================================
    // TAB FUNCTION
    // =====================================================

    function openTab(tabName) {

        // Sidebar navigation
        navItems.forEach((item) => {

            item.classList.toggle(
                "active",
                item.dataset.tab === tabName
            );

        });


        // Content tabs
        contentTabs.forEach((tab) => {

            tab.classList.toggle(
                "active",
                tab.dataset.content === tabName
            );

        });


        // Content sections
        contentViews.forEach((view) => {

            view.classList.toggle(
                "active",
                view.id === tabName
            );

        });


        // Update URL hash
        history.replaceState(
            null,
            "",
            `#${tabName}`
        );

    }


    // =====================================================
    // SIDEBAR NAVIGATION
    // =====================================================

    navItems.forEach((item) => {

        item.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openTab(
                    item.dataset.tab
                );

            }
        );

    });


    // =====================================================
    // CONTENT TABS
    // =====================================================

    contentTabs.forEach((tab) => {

        tab.addEventListener(
            "click",
            () => {

                openTab(
                    tab.dataset.content
                );

            }
        );

    });


    // =====================================================
    // OPEN TAB BUTTONS
    // =====================================================

    openTabButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                openTab(
                    button.dataset.openTab
                );

            }
        );

    });


    // =====================================================
    // OPEN HASH TAB
    // =====================================================

    const hash =
        window.location.hash.replace(
            "#",
            ""
        );


    if (
        hash &&
        document.getElementById(hash)
    ) {

        openTab(hash);

    }


    // =====================================================
    // INVITE MODAL
    // =====================================================

    const inviteModal =
        document.getElementById(
            "inviteModal"
        );

    const inviteButtons = [
        document.getElementById("inviteButton"),
        document.getElementById("welcomeInvite"),
        document.getElementById("membersInvite")
    ];


    function openInviteModal() {

        inviteModal.classList.add(
            "open"
        );

    }


    function closeInviteModal() {

        inviteModal.classList.remove(
            "open"
        );

    }


    inviteButtons.forEach((button) => {

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            openInviteModal
        );

    });


    document
        .getElementById("closeInvite")
        .addEventListener(
            "click",
            closeInviteModal
        );


    inviteModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                inviteModal
            ) {

                closeInviteModal();

            }

        }
    );


    // =====================================================
    // COPY INVITE
    // =====================================================

    const copyInvite =
        document.getElementById(
            "copyInvite"
        );


    copyInvite.addEventListener(
        "click",
        async () => {

            const code =
                document
                    .querySelector(
                        ".invite-code strong"
                    )
                    .textContent;


            try {

                await navigator.clipboard.writeText(
                    code
                );


                copyInvite.innerHTML =
                    `<i class="fa-solid fa-check"></i>`;


                setTimeout(
                    () => {

                        copyInvite.innerHTML =
                            `<i class="fa-regular fa-copy"></i>`;

                    },
                    1500
                );


            } catch (error) {

                console.error(
                    "Copy failed:",
                    error
                );

            }

        }
    );


    // =====================================================
    // SHARE
    // =====================================================

    const shareButton =
        document.getElementById(
            "shareButton"
        );

    const shareInvite =
        document.getElementById(
            "shareInvite"
        );


    async function shareSpace() {

        const shareData = {

            title: "everUS Space",

            text:
                "Join my private everUS space.",

            url:
                window.location.href

        };


        if (
            navigator.share
        ) {

            try {

                await navigator.share(
                    shareData
                );

            } catch {
                // User cancelled
            }

        } else {

            await navigator.clipboard.writeText(
                window.location.href
            );

            alert(
                "Space link copied!"
            );

        }

    }


    shareButton.addEventListener(
        "click",
        shareSpace
    );


    shareInvite.addEventListener(
        "click",
        shareSpace
    );


    // =====================================================
    // MOBILE SIDEBAR
    // =====================================================

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );

    const sidebar =
        document.querySelector(
            ".space-sidebar"
        );


    mobileMenu.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );


    // =====================================================
    // COVER IMAGE UI
    // =====================================================

    const changeCover =
        document.getElementById(
            "changeCover"
        );

    changeCover.addEventListener(
        "click",
        () => {

            const input =
                document.createElement(
                    "input"
                );

            input.type = "file";

            input.accept =
                "image/png,image/jpeg,image/webp";


            input.addEventListener(
                "change",
                () => {

                    const file =
                        input.files[0];

                    if (!file) {
                        return;
                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        (event) => {

                            document
                                .getElementById(
                                    "spaceCover"
                                )
                                .style.backgroundImage =
                                `url("${event.target.result}")`;

                        };


                    reader.readAsDataURL(
                        file
                    );

                }
            );


            input.click();

        }
    );


});