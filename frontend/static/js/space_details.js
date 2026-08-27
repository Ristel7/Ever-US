document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    const navItems = document.querySelectorAll(".space-nav-item");
    const contentTabs = document.querySelectorAll(".content-tab");
    const contentViews = document.querySelectorAll(".content-view");
    const openTabButtons = document.querySelectorAll("[data-open-tab]");

    const spaceName = document.getElementById("spaceName");
    const spaceDescription = document.getElementById("spaceDescription");
    const memberCount = document.getElementById("memberCount");
    const spaceCover = document.getElementById("spaceCover");

    const urlParts = window.location.pathname.split("/").filter(Boolean);
    const spaceId = urlParts[urlParts.length - 1];

    if (!spaceId || spaceId === "space-details") {
        console.error("Space ID was not found in the URL.");
        return;
    }

    async function api(url, options = {}) {

        const response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
            return null;
        }

        return response;
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function openTab(tabName) {

        navItems.forEach(item => {
            item.classList.toggle(
                "active",
                item.dataset.tab === tabName
            );
        });

        contentTabs.forEach(tab => {
            tab.classList.toggle(
                "active",
                tab.dataset.content === tabName
            );
        });

        contentViews.forEach(view => {
            view.classList.toggle(
                "active",
                view.id === tabName
            );
        });

        history.replaceState(
            null,
            "",
            `#${tabName}`
        );
    }

    navItems.forEach(item => {

        item.addEventListener("click", event => {

            event.preventDefault();

            openTab(item.dataset.tab);

        });

    });

    contentTabs.forEach(tab => {

        tab.addEventListener("click", () => {

            openTab(tab.dataset.content);

        });

    });

    openTabButtons.forEach(button => {

        button.addEventListener("click", () => {

            openTab(button.dataset.openTab);

        });

    });

    const initialHash =
        window.location.hash.replace("#", "");

    if (
        initialHash &&
        document.getElementById(initialHash)
    ) {
        openTab(initialHash);
    }


    async function loadSpace() {

        try {

            console.log("Loading space:", spaceId);

            const response =
                await api(`/api/spaces/${spaceId}`);

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

            const name =
                space.space_name ||
                space.name ||
                "Untitled Space";

            const description =
                space.description ||
                "A private place for the moments that matter.";

            spaceName.textContent = name;

            spaceDescription.textContent =
                description;


            const typeElement =
                document.querySelector(".space-type");

            if (typeElement) {

                const type =
                    space.space_type ||
                    space.type ||
                    "private";

                typeElement.textContent =
                    `${String(type).toUpperCase()} SPACE`;

            }


            if (
                space.cover_image &&
                spaceCover
            ) {

                spaceCover.style.backgroundImage =
                    `url("${escapeHtml(space.cover_image)}")`;

            }


            const members =
                Array.isArray(space.members)
                    ? space.members
                    : [];

            const count =
                space.member_count ??
                members.length ??
                1;

            if (memberCount) {

                memberCount.textContent =
                    `${count} ${count === 1 ? "member" : "members"}`;

            }


            updateMemberAvatars(members);

        }

        catch (error) {

            console.error(
                "Space loading error:",
                error
            );

            if (spaceName) {

                spaceName.textContent =
                    "Unable to load space";

            }

            if (spaceDescription) {

                spaceDescription.textContent =
                    error.message;

            }

        }

    }


    function updateMemberAvatars(members) {

        if (!Array.isArray(members) || !members.length) {
            return;
        }

        const avatars =
            document.querySelectorAll(
                ".member-stack .member-avatar"
            );

        members
            .slice(0, 3)
            .forEach((member, index) => {

                if (!avatars[index]) {
                    return;
                }

                const name =
                    member.name ||
                    member.user_name ||
                    member.email ||
                    "U";

                avatars[index].textContent =
                    name.charAt(0).toUpperCase();

            });

    }


    // =====================================================
    // INVITE MODAL
    // =====================================================

    const inviteModal =
        document.getElementById("inviteModal");

    const inviteButtons = [
        document.getElementById("inviteButton"),
        document.getElementById("welcomeInvite"),
        document.getElementById("membersInvite")
    ];

    function openInviteModal() {

        if (!inviteModal) {
            return;
        }

        inviteModal.classList.add("open");

    }

    function closeInviteModal() {

        if (!inviteModal) {
            return;
        }

        inviteModal.classList.remove("open");

    }

    inviteButtons.forEach(button => {

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            openInviteModal
        );

    });


    const closeInvite =
        document.getElementById("closeInvite");

    if (closeInvite) {

        closeInvite.addEventListener(
            "click",
            closeInviteModal
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

                    closeInviteModal();

                }

            }
        );

    }


    // =====================================================
    // COPY INVITE
    // =====================================================

    const copyInvite =
        document.getElementById("copyInvite");

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

                try {

                    await navigator.clipboard.writeText(
                        code
                    );

                    copyInvite.innerHTML =
                        `<i class="fa-solid fa-check"></i>`;

                    setTimeout(() => {

                        copyInvite.innerHTML =
                            `<i class="fa-regular fa-copy"></i>`;

                    }, 1500);

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
    // SHARE
    // =====================================================

    const shareButton =
        document.getElementById("shareButton");

    const shareInvite =
        document.getElementById("shareInvite");

    async function shareSpace() {

        const shareData = {

            title: spaceName
                ? spaceName.textContent
                : "everUS Space",

            text:
                "Join my private everUS space.",

            url:
                window.location.href

        };

        if (navigator.share) {

            try {

                await navigator.share(
                    shareData
                );

            }

            catch {

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
        document.getElementById("mobileMenu");

    const sidebar =
        document.querySelector(".space-sidebar");

    if (mobileMenu && sidebar) {

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
        document.getElementById("changeCover");

    if (changeCover && spaceCover) {

        changeCover.addEventListener(
            "click",
            () => {

                const input =
                    document.createElement("input");

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
                            event => {

                                spaceCover.style.backgroundImage =
                                    `url("${event.target.result}")`;

                            };

                        reader.readAsDataURL(file);

                    }
                );

                input.click();

            }
        );

    }


    // =====================================================
    // LOAD SPACE
    // =====================================================

    loadSpace();

});