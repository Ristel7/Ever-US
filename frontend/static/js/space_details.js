document.addEventListener("DOMContentLoaded", () => {

    console.log("everUS Space Details JS loaded");


    // =====================================================
    // AUTHENTICATION
    // =====================================================

    const token =
        localStorage.getItem("access_token");

    if (!token) {

        console.warn(
            "No authentication token found."
        );

        window.location.href = "/login";

        return;
    }


    // =====================================================
    // GET SPACE ID FROM URL
    // =====================================================

    const urlParts =
        window.location.pathname
            .split("/")
            .filter(Boolean);

    const spaceId =
        urlParts[urlParts.length - 1];


    if (!spaceId) {

        console.error(
            "Space ID was not found in URL."
        );

        return;
    }


    console.log(
        "Current Space ID:",
        spaceId
    );


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
    // SPACE ELEMENTS
    // =====================================================

    const spaceNameElement =
        document.getElementById(
            "spaceName"
        );

    const spaceDescriptionElement =
        document.getElementById(
            "spaceDescription"
        );

    const memberCountElement =
        document.getElementById(
            "memberCount"
        );

    const spaceCover =
        document.getElementById(
            "spaceCover"
        );

    const spaceTypeElement =
        document.querySelector(
            ".space-type"
        );


    // =====================================================
    // API HELPER
    // =====================================================

    async function api(
        url,
        options = {}
    ) {

        try {

            const headers = {
                ...(options.headers || {}),
                "Authorization":
                    `Bearer ${token}`
            };


            /*
             * Only add JSON content type when
             * the request is not using FormData.
             */

            if (
                !(options.body instanceof FormData)
            ) {

                headers["Content-Type"] =
                    "application/json";

            }


            const response =
                await fetch(
                    url,
                    {
                        ...options,
                        headers
                    }
                );


            // =============================================
            // TOKEN EXPIRED / UNAUTHORIZED
            // =============================================

            if (
                response.status === 401
            ) {

                console.warn(
                    "Authentication expired."
                );

                localStorage.removeItem(
                    "access_token"
                );

                localStorage.removeItem(
                    "user"
                );

                localStorage.removeItem(
                    "is_logged_in"
                );

                window.location.href =
                    "/login";

                return null;
            }


            return response;

        }

        catch (error) {

            console.error(
                "API request failed:",
                error
            );

            throw error;

        }

    }


    // =====================================================
    // HTML ESCAPE
    // =====================================================

    function escapeHtml(value) {

        return String(value ?? "")
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
    // TAB FUNCTION
    // =====================================================

    function openTab(tabName) {

        // -----------------------------------------------
        // Sidebar navigation
        // -----------------------------------------------

        navItems.forEach(
            (item) => {

                item.classList.toggle(
                    "active",
                    item.dataset.tab ===
                    tabName
                );

            }
        );


        // -----------------------------------------------
        // Content tabs
        // -----------------------------------------------

        contentTabs.forEach(
            (tab) => {

                tab.classList.toggle(
                    "active",
                    tab.dataset.content ===
                    tabName
                );

            }
        );


        // -----------------------------------------------
        // Content sections
        // -----------------------------------------------

        contentViews.forEach(
            (view) => {

                view.classList.toggle(
                    "active",
                    view.id ===
                    tabName
                );

            }
        );


        // -----------------------------------------------
        // URL hash
        // -----------------------------------------------

        history.replaceState(
            null,
            "",
            `#${tabName}`
        );

    }


    // =====================================================
    // SIDEBAR NAVIGATION
    // =====================================================

    navItems.forEach(
        (item) => {

            item.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    openTab(
                        item.dataset.tab
                    );

                }
            );

        }
    );


    // =====================================================
    // CONTENT TABS
    // =====================================================

    contentTabs.forEach(
        (tab) => {

            tab.addEventListener(
                "click",
                () => {

                    openTab(
                        tab.dataset.content
                    );

                }
            );

        }
    );


    // =====================================================
    // OPEN TAB BUTTONS
    // =====================================================

    openTabButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    openTab(
                        button.dataset.openTab
                    );

                }
            );

        }
    );


    // =====================================================
    // OPEN TAB FROM HASH
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
    // LOAD SPACE
    // =====================================================

    async function loadSpace() {

        try {

            console.log(
                "Loading space:",
                spaceId
            );


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
                "Space API response:",
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
                    "Space data was not returned."
                );

            }


            console.log(
                "Loaded space:",
                space
            );


            // =============================================
            // SPACE NAME
            // =============================================

            const name =
                space.space_name ||
                space.name ||
                "Untitled Space";


            if (spaceNameElement) {

                spaceNameElement.textContent =
                    name;

            }


            // =============================================
            // DESCRIPTION
            // =============================================

            const description =
                space.description ||
                "A private place for the moments that matter.";


            if (spaceDescriptionElement) {

                spaceDescriptionElement.textContent =
                    description;

            }


            // =============================================
            // SPACE TYPE
            // =============================================

            const type =
                space.space_type ||
                space.type ||
                "private";


            if (spaceTypeElement) {

                spaceTypeElement.textContent =
                    `${String(type).toUpperCase()} SPACE`;

            }


            // =============================================
            // COVER IMAGE
            // =============================================

            if (
                space.cover_image &&
                spaceCover
            ) {

                spaceCover.style.backgroundImage =
                    `url("${space.cover_image}")`;

            }


            // =============================================
            // INVITE CODE
            // =============================================

            const inviteCode =
                space.invite_code ||
                "Unavailable";


            const inviteCodeElement =
                document.querySelector(
                    ".invite-code strong"
                );


            if (inviteCodeElement) {

                inviteCodeElement.textContent =
                    inviteCode;

            }


            // =============================================
            // MEMBER COUNT FROM SPACE DATA
            // =============================================

            if (
                memberCountElement &&
                typeof space.member_count !==
                "undefined"
            ) {

                const count =
                    Number(
                        space.member_count
                    );


                memberCountElement.textContent =
                    `${count} ${count === 1
                        ? "member"
                        : "members"
                    }`;

            }

        }

        catch (error) {

            console.error(
                "Space loading error:",
                error
            );


            if (spaceNameElement) {

                spaceNameElement.textContent =
                    "Unable to load space";

            }


            if (spaceDescriptionElement) {

                spaceDescriptionElement.textContent =
                    error.message ||
                    "Something went wrong.";

            }

        }

    }


    // =====================================================
    // LOAD MEMBERS
    // =====================================================

    async function loadMembers() {

        try {

            console.log(
                "Loading members for space:",
                spaceId
            );


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


            updateMembersUI(
                members
            );

        }

        catch (error) {

            console.error(
                "Members loading error:",
                error
            );

        }

    }


    // =====================================================
    // UPDATE MEMBERS UI
    // =====================================================

    function updateMembersUI(members) {

        // =====================================================
        // MEMBER COUNT
        // =====================================================

        if (memberCountElement) {

            memberCountElement.textContent =
                `${members.length} ${members.length === 1
                    ? "member"
                    : "members"
                }`;

        }


        // =====================================================
        // MEMBER CONTAINER
        // =====================================================

        const memberContainer =
            document.querySelector(
                ".members-list"
            );


        if (!memberContainer) {

            console.warn(
                "Members list container not found."
            );

            return;

        }


        // =====================================================
        // EMPTY STATE
        // =====================================================

        if (!members.length) {

            memberContainer.innerHTML = `
            <div class="members-empty">
                <i class="fa-solid fa-user-plus"></i>

                <span>
                    Invite people to share
                    this space.
                </span>
            </div>
        `;

            return;

        }


        // =====================================================
        // RENDER MEMBERS
        // =====================================================

        memberContainer.innerHTML = "";


        members.forEach(member => {

            const name =
                member.name ||
                "Unknown User";

            const email =
                member.email ||
                "";

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


            const memberCard =
                document.createElement(
                    "div"
                );


            memberCard.className =
                "member-card";


            memberCard.innerHTML = `

            <div class="member-avatar">

                ${profileImage
                    ? `
                            <img
                                src="${escapeHtml(profileImage)}"
                                alt="${escapeHtml(name)}"
                            >
                          `
                    : `
                            <span>
                                ${escapeHtml(initial)}
                            </span>
                          `
                }

            </div>


            <div class="member-info">

                <h3>
                    ${escapeHtml(name)}
                </h3>

                <p>
                    ${escapeHtml(email)}
                </p>

            </div>


            <div class="member-role">

                <span class="role-badge ${escapeHtml(role)}">

                    ${role === "owner"
                    ? "Owner"
                    : "Member"
                }

                </span>

            </div>

        `;


            memberContainer.appendChild(
                memberCard
            );

        });

    }


    // =====================================================
    // INVITE MODAL
    // =====================================================

    const inviteModal =
        document.getElementById(
            "inviteModal"
        );


    const inviteButtons = [

        document.getElementById(
            "inviteButton"
        ),

        document.getElementById(
            "welcomeInvite"
        ),

        document.getElementById(
            "membersInvite"
        )

    ];


    function openInviteModal() {

        if (!inviteModal) {
            return;
        }


        inviteModal.classList.add(
            "open"
        );

    }


    function closeInviteModal() {

        if (!inviteModal) {
            return;
        }


        inviteModal.classList.remove(
            "open"
        );

    }


    inviteButtons.forEach(
        (button) => {

            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                openInviteModal
            );

        }
    );


    const closeInvite =
        document.getElementById(
            "closeInvite"
        );


    if (closeInvite) {

        closeInvite.addEventListener(
            "click",
            closeInviteModal
        );

    }


    if (inviteModal) {

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

                const codeElement =
                    document.querySelector(
                        ".invite-code strong"
                    );


                if (!codeElement) {
                    return;
                }


                const code =
                    codeElement.textContent.trim();


                if (
                    !code ||
                    code === "Unavailable"
                ) {

                    return;

                }


                try {

                    await navigator.clipboard.writeText(
                        code
                    );


                    copyInvite.innerHTML =
                        `
                        <i class="fa-solid fa-check"></i>
                        `;


                    setTimeout(
                        () => {

                            copyInvite.innerHTML =
                                `
                                <i class="fa-regular fa-copy"></i>
                                `;

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
    // SHARE SPACE
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

        const title =
            spaceNameElement
                ? spaceNameElement.textContent
                : "everUS Space";


        const shareData = {

            title: title,

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

            }

            catch {

                // User cancelled share

            }

        }

        else {

            try {

                await navigator.clipboard.writeText(
                    window.location.href
                );


                alert(
                    "Space link copied!"
                );

            }

            catch {

                alert(
                    "Unable to copy space link."
                );

            }

        }

    }


    if (shareButton) {

        shareButton.addEventListener(
            "click",
            shareSpace
        );

    }


    if (shareInvite) {

        shareInvite.addEventListener(
            "click",
            shareSpace
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
        document.querySelector(
            ".space-sidebar"
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
    // COVER IMAGE PREVIEW
    // =====================================================

    const changeCover =
        document.getElementById(
            "changeCover"
        );


    if (
        changeCover &&
        spaceCover
    ) {

        changeCover.addEventListener(
            "click",
            () => {

                const input =
                    document.createElement(
                        "input"
                    );


                input.type =
                    "file";


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

                                spaceCover.style.backgroundImage =
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

    }


    // =====================================================
    // INITIAL API LOAD
    // =====================================================

    loadSpace();

    loadMembers();

});