document.addEventListener("DOMContentLoaded", () => {

    console.log("everUS Members JS loaded");


    // =====================================================
    // AUTHENTICATION
    // =====================================================

    const token =
        localStorage.getItem("access_token");

    if (!token) {

        window.location.href =
            "/login";

        return;
    }


    // =====================================================
    // SPACE ID
    // =====================================================

    const pathParts =
        window.location.pathname
            .split("/")
            .filter(Boolean);

    const spaceId =
        pathParts[pathParts.length - 1];


    if (!spaceId) {

        console.error(
            "Space ID not found."
        );

        return;
    }


    console.log(
        "Members page space ID:",
        spaceId
    );


    // =====================================================
    // ELEMENTS
    // =====================================================

    const membersList =
        document.getElementById(
            "membersList"
        );

    const membersLoading =
        document.getElementById(
            "membersLoading"
        );

    const memberSearchEmpty =
        document.getElementById(
            "memberSearchEmpty"
        );

    const memberCount =
        document.getElementById(
            "memberCount"
        );

    const memberSearch =
        document.getElementById(
            "memberSearch"
        );

    const spaceName =
        document.getElementById(
            "spaceName"
        );

    const spaceType =
        document.getElementById(
            "spaceType"
        );

    const inviteCode =
        document.getElementById(
            "inviteCode"
        );


    // =====================================================
    // API HELPER
    // =====================================================

    async function api(
        url,
        options = {}
    ) {

        const response =
            await fetch(
                url,
                {
                    ...options,

                    headers: {
                        ...(options.headers || {}),

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (
            response.status === 401
        ) {

            localStorage.clear();

            window.location.href =
                "/login";

            return null;
        }


        return response;
    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHtml(value) {

        return String(
            value ?? ""
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }


    // =====================================================
    // LOAD SPACE
    // =====================================================

    async function loadSpace() {

        try {

            const response =
                await api(
                    `/api/spaces/${spaceId}`
                );


            if (!response) {
                return;
            }


            const result =
                await response.json();


            console.log(
                "Space response:",
                result
            );


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "Unable to load space."
                );

            }


            const space =
                result.data?.space ||
                result.data;


            if (!space) {
                throw new Error(
                    "Space data not found."
                );
            }


            // Space name

            if (spaceName) {

                spaceName.textContent =
                    space.space_name ||
                    "Untitled Space";

            }


            // Space type

            if (spaceType) {

                const type =
                    space.space_type ||
                    "private";

                spaceType.textContent =
                    `${String(type)
                        .charAt(0)
                        .toUpperCase()}${String(type)
                            .slice(1)} Space`;

            }


            // Invite code

            if (inviteCode) {

                inviteCode.textContent =
                    space.invite_code ||
                    "Unavailable";

            }

        }

        catch (error) {

            console.error(
                "Space loading error:",
                error
            );

        }

    }


    // =====================================================
    // CREATE MEMBER CARD
    // =====================================================

    function createMemberCard(
        member
    ) {

        const card =
            document.createElement(
                "article"
            );

        card.className =
            "member-card";


        const name =
            member.name ||
            member.email ||
            "Unknown User";


        const email =
            member.email ||
            "No email available";


        const role =
            member.role ||
            "member";


        const profileImage =
            member.profile_image ||
            "";


        const initial =
            name
                .charAt(0)
                .toUpperCase();


        const roleLabel =
            role === "owner"
                ? "Owner"
                : "Member";


        const avatarHTML =
            profileImage
                ? `
                    <img
                        src="${escapeHtml(profileImage)}"
                        alt="${escapeHtml(name)}"
                    >
                `
                : initial;


        const joinedDate =
            member.joined_at
                ? new Date(
                    member.joined_at
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                )
                : "Recently";


        card.dataset.name =
            name.toLowerCase();


        card.innerHTML = `

            <div class="member-left">

                <div class="member-avatar purple-avatar">

                    ${avatarHTML}

                </div>


                <div class="member-details">

                    <div class="member-name-row">

                        <h3>
                            ${escapeHtml(name)}
                        </h3>

                        <span class="${role === "owner"
                ? "owner-badge"
                : "member-badge"
            }">

                            ${roleLabel}

                        </span>

                    </div>


                    <p>
                        ${escapeHtml(email)}
                    </p>


                    <span class="member-active">

                        <span></span>

                        Active

                    </span>

                </div>

            </div>


            <div class="member-actions">

                <span class="joined-date">

                    Joined ${escapeHtml(
                joinedDate
            )}

                </span>


                <button
                    type="button"
                    class="member-menu"
                    data-member="${escapeHtml(name)}"
                >

                    <i class="fa-solid fa-ellipsis"></i>

                </button>

            </div>

        `;


        return card;

    }


    // =====================================================
    // LOAD MEMBERS
    // =====================================================

    async function loadMembers() {

        try {

            if (membersLoading) {

                membersLoading.style.display =
                    "flex";

            }


            const response =
                await api(
                    `/api/spaces/${spaceId}/members`
                );


            if (!response) {
                return;
            }


            const result =
                await response.json();


            console.log(
                "Members API response:",
                result
            );


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "Unable to load members."
                );

            }


            const members =
                Array.isArray(
                    result.data?.members
                )
                    ? result.data.members
                    : [];


            console.log(
                "Members:",
                members
            );


            if (membersLoading) {

                membersLoading.style.display =
                    "none";

            }


            if (memberCount) {

                memberCount.textContent =
                    members.length;

            }


            // Remove old dynamically generated cards

            membersList
                .querySelectorAll(
                    ".member-card"
                )
                .forEach(card => {
                    card.remove();
                });


            if (!members.length) {

                if (memberSearchEmpty) {

                    memberSearchEmpty.style.display =
                        "block";

                    memberSearchEmpty.querySelector(
                        "h3"
                    ).textContent =
                        "No members yet";

                    memberSearchEmpty.querySelector(
                        "p"
                    ).textContent =
                        "Invite someone to your space.";

                }

                return;
            }


            if (memberSearchEmpty) {

                memberSearchEmpty.style.display =
                    "none";

            }


            members.forEach(
                member => {

                    membersList.appendChild(
                        createMemberCard(
                            member
                        )
                    );

                }
            );


            setupMemberMenus();

        }

        catch (error) {

            console.error(
                "Members loading error:",
                error
            );


            if (membersLoading) {

                membersLoading.innerHTML = `

                    <i class="
                        fa-solid
                        fa-triangle-exclamation
                    "></i>

                    <span>
                        Unable to load members.
                    </span>

                `;

            }

        }

    }


    // =====================================================
    // MEMBER SEARCH
    // =====================================================

    if (memberSearch) {

        memberSearch.addEventListener(
            "input",
            () => {

                const query =
                    memberSearch.value
                        .trim()
                        .toLowerCase();


                const cards =
                    membersList.querySelectorAll(
                        ".member-card"
                    );


                let visibleCount = 0;


                cards.forEach(card => {

                    const name =
                        card.dataset.name ||
                        card.textContent
                            .toLowerCase();


                    const visible =
                        !query ||
                        name.includes(query);


                    card.style.display =
                        visible
                            ? ""
                            : "none";


                    if (visible) {
                        visibleCount++;
                    }

                });


                if (memberSearchEmpty) {

                    memberSearchEmpty.style.display =
                        visibleCount === 0
                            ? "block"
                            : "none";

                }

            }
        );

    }


    // =====================================================
    // MEMBER MENU
    // =====================================================

    function setupMemberMenus() {

        const menuButtons =
            document.querySelectorAll(
                ".member-menu"
            );


        menuButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        const memberName =
                            button.dataset.member;

                        console.log(
                            "Member selected:",
                            memberName
                        );

                    }
                );

            }
        );

    }


    // =====================================================
    // COPY INVITE CODE
    // =====================================================

    const copyInvite =
        document.getElementById(
            "copyInvite"
        );


    if (copyInvite) {

        copyInvite.addEventListener(
            "click",
            async () => {

                const code =
                    inviteCode
                        ? inviteCode.textContent.trim()
                        : "";


                if (
                    !code ||
                    code === "Loading..." ||
                    code === "Unavailable"
                ) {

                    return;

                }


                try {

                    await navigator.clipboard
                        .writeText(code);


                    copyInvite.innerHTML =
                        `<i class="
                            fa-solid
                            fa-check
                        "></i>`;


                    setTimeout(
                        () => {

                            copyInvite.innerHTML =
                                `<i class="
                                    fa-regular
                                    fa-copy
                                "></i>`;

                        },
                        1500
                    );

                }

                catch (error) {

                    console.error(
                        "Copy invite failed:",
                        error
                    );

                }

            }
        );

    }


    // =====================================================
    // INVITE MODAL
    // =====================================================

    const inviteModal =
        document.getElementById(
            "inviteModal"
        );

    const openInvite =
        document.getElementById(
            "openInviteModal"
        );

    const inviteMainButton =
        document.getElementById(
            "inviteMainButton"
        );

    const closeInvite =
        document.getElementById(
            "closeInviteModal"
        );


    function showInviteModal() {

        if (!inviteModal) {
            return;
        }

        inviteModal.classList.add(
            "open"
        );

    }


    function hideInviteModal() {

        if (!inviteModal) {
            return;
        }

        inviteModal.classList.remove(
            "open"
        );

    }


    if (openInvite) {

        openInvite.addEventListener(
            "click",
            showInviteModal
        );

    }


    if (inviteMainButton) {

        inviteMainButton.addEventListener(
            "click",
            showInviteModal
        );

    }


    if (closeInvite) {

        closeInvite.addEventListener(
            "click",
            hideInviteModal
        );

    }


    if (inviteModal) {

        inviteModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    inviteModal
                ) {

                    hideInviteModal();

                }

            }
        );

    }


    // =====================================================
    // COPY MODAL CODE
    // =====================================================

    const modalCopyCode =
        document.getElementById(
            "modalCopyCode"
        );


    if (modalCopyCode) {

        modalCopyCode.addEventListener(
            "click",
            async () => {

                const code =
                    inviteCode
                        ? inviteCode.textContent.trim()
                        : "";


                if (!code) {
                    return;
                }


                try {

                    await navigator.clipboard
                        .writeText(code);


                    modalCopyCode.innerHTML =
                        `<i class="
                            fa-solid
                            fa-check
                        "></i>`;


                    setTimeout(
                        () => {

                            modalCopyCode.innerHTML =
                                `<i class="
                                    fa-regular
                                    fa-copy
                                "></i>`;

                        },
                        1500
                    );

                }

                catch (error) {

                    console.error(
                        "Copy failed:",
                        error
                    );

                }

            }
        );

    }


    // =====================================================
    // COPY INVITE LINK
    // =====================================================

    const copyInviteLink =
        document.getElementById(
            "copyInviteLink"
        );


    if (copyInviteLink) {

        copyInviteLink.addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard
                        .writeText(
                            window.location.href
                        );


                    copyInviteLink.innerHTML =
                        `<i class="
                            fa-solid
                            fa-check
                        "></i>
                        Link Copied!`;


                    setTimeout(
                        () => {

                            copyInviteLink.innerHTML =
                                `<i class="
                                    fa-solid
                                    fa-link
                                "></i>
                                Copy Invite Link`;

                        },
                        1500
                    );

                }

                catch (error) {

                    console.error(
                        "Copy link failed:",
                        error
                    );

                }

            }
        );

    }


    // =====================================================
    // MOBILE SIDEBAR
    // =====================================================

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );

    const sidebar =
        document.getElementById(
            "membersSidebar"
        );


    if (
        mobileMenu &&
        sidebar
    ) {

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
    // START
    // =====================================================

    loadSpace();

    loadMembers();

});