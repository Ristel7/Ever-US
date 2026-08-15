document.addEventListener("DOMContentLoaded", () => {


    // =====================================================
    // ELEMENTS
    // =====================================================

    const sidebar =
        document.getElementById("membersSidebar");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const inviteModal =
        document.getElementById("inviteModal");

    const openInviteModal =
        document.getElementById("openInviteModal");

    const inviteMainButton =
        document.getElementById("inviteMainButton");

    const closeInviteModal =
        document.getElementById("closeInviteModal");

    const inviteForm =
        document.getElementById("inviteForm");

    const inviteEmail =
        document.getElementById("inviteEmail");

    const copyInvite =
        document.getElementById("copyInvite");

    const modalCopyCode =
        document.getElementById("modalCopyCode");

    const copyInviteLink =
        document.getElementById("copyInviteLink");

    const inviteCode =
        document.getElementById("inviteCode");

    const memberSearch =
        document.getElementById("memberSearch");

    const memberCards =
        document.querySelectorAll(".member-card");

    const memberSearchEmpty =
        document.getElementById(
            "memberSearchEmpty"
        );

    const memberActionMenu =
        document.getElementById(
            "memberActionMenu"
        );

    const viewMember =
        document.getElementById("viewMember");

    const messageMember =
        document.getElementById("messageMember");

    const removeMember =
        document.getElementById("removeMember");


    let selectedMember = null;


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
    // INVITE MODAL
    // =====================================================

    function openModal() {

        inviteModal.classList.add(
            "open"
        );

        document.body.style.overflow =
            "hidden";

    }


    function closeModal() {

        inviteModal.classList.remove(
            "open"
        );

        document.body.style.overflow =
            "";

    }


    openInviteModal.addEventListener(
        "click",
        openModal
    );


    inviteMainButton.addEventListener(
        "click",
        openModal
    );


    closeInviteModal.addEventListener(
        "click",
        closeModal
    );


    inviteModal.addEventListener(
        "click",
        event => {

            if (
                event.target === inviteModal
            ) {

                closeModal();

            }

        }
    );


    // =====================================================
    // COPY FUNCTION
    // =====================================================

    async function copyText(
        text,
        button
    ) {

        try {

            await navigator.clipboard.writeText(
                text
            );


            const original =
                button.innerHTML;


            button.innerHTML =
                '<i class="fa-solid fa-check"></i>';


            setTimeout(
                () => {

                    button.innerHTML =
                        original;

                },
                1200
            );

        } catch (error) {

            console.error(
                "Copy failed:",
                error
            );

        }

    }


    copyInvite.addEventListener(
        "click",
        () => {

            copyText(
                inviteCode.textContent.trim(),
                copyInvite
            );

        }
    );


    modalCopyCode.addEventListener(
        "click",
        () => {

            copyText(
                "EVUS-7K29X",
                modalCopyCode
            );

        }
    );


    copyInviteLink.addEventListener(
        "click",
        () => {

            const link =
                `${window.location.origin}/join/EVUS-7K29X`;


            copyText(
                link,
                copyInviteLink
            );

        }
    );


    // =====================================================
    // INVITE FORM
    // =====================================================

    inviteForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                inviteEmail.value.trim();


            if (!email) {

                inviteEmail.focus();

                return;

            }


            const button =
                inviteForm.querySelector(
                    ".send-invite"
                );


            button.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Sending...
            `;


            button.disabled =
                true;


            /*
             * UI only for now.
             *
             * This will later call:
             *
             * POST /api/invite
             *
             */

            setTimeout(
                () => {

                    button.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Invitation Sent
                    `;


                    setTimeout(
                        () => {

                            inviteForm.reset();

                            button.innerHTML = `
                                <i class="fa-solid fa-paper-plane"></i>
                                Send Invitation
                            `;

                            button.disabled =
                                false;

                            closeModal();

                        },
                        900
                    );

                },
                900
            );

        }
    );


    // =====================================================
    // MEMBER SEARCH
    // =====================================================

    memberSearch.addEventListener(
        "input",
        () => {

            const query =
                memberSearch.value
                    .trim()
                    .toLowerCase();


            let visible =
                0;


            memberCards.forEach(
                card => {

                    const name =
                        card.dataset.name
                            .toLowerCase();


                    const matches =
                        name.includes(
                            query
                        );


                    card.style.display =
                        matches
                            ? "flex"
                            : "none";


                    if (matches) {

                        visible++;

                    }

                }
            );


            memberSearchEmpty.style.display =
                visible === 0
                    ? "block"
                    : "none";

        }
    );


    // =====================================================
    // MEMBER ACTION MENU
    // =====================================================

    document
        .querySelectorAll(".member-menu")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    selectedMember =
                        button.dataset.member;


                    const rect =
                        button.getBoundingClientRect();


                    memberActionMenu.style.left =
                        `${rect.right - 175}px`;


                    memberActionMenu.style.top =
                        `${rect.bottom + 7}px`;


                    memberActionMenu.classList.add(
                        "open"
                    );

                }
            );

        });


    // =====================================================
    // MENU ACTIONS
    // =====================================================

    viewMember.addEventListener(
        "click",
        () => {

            if (!selectedMember) {
                return;
            }


            alert(
                `Profile of ${selectedMember} will be connected later.`
            );


            closeMemberMenu();

        }
    );


    messageMember.addEventListener(
        "click",
        () => {

            if (!selectedMember) {
                return;
            }


            alert(
                `Messaging ${selectedMember} will be connected later.`
            );


            closeMemberMenu();

        }
    );


    removeMember.addEventListener(
        "click",
        () => {

            if (!selectedMember) {
                return;
            }


            const confirmed =
                confirm(
                    `Remove ${selectedMember} from this space?`
                );


            if (confirmed) {

                alert(
                    `${selectedMember} will be removed after API integration.`
                );

            }


            closeMemberMenu();

        }
    );


    function closeMemberMenu() {

        memberActionMenu.classList.remove(
            "open"
        );

        selectedMember =
            null;

    }


    // =====================================================
    // CLOSE MENU WHEN CLICKING OUTSIDE
    // =====================================================

    document.addEventListener(
        "click",
        event => {

            if (
                !memberActionMenu.contains(
                    event.target
                ) &&
                !event.target.closest(
                    ".member-menu"
                )
            ) {

                closeMemberMenu();

            }

        }
    );


    // =====================================================
    // ESCAPE
    // =====================================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {

                return;

            }


            if (
                inviteModal.classList.contains(
                    "open"
                )
            ) {

                closeModal();

            }


            closeMemberMenu();

        }
    );

});