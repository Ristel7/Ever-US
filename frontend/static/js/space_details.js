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
        // MEMBERS CARD
        // =====================================================

        const membersCard =
            document.querySelector(
                ".members-card"
            );


        if (!membersCard) {

            console.warn(
                "Members card not found."
            );

            return;

        }


        // =====================================================
        // EMPTY STATE
        // =====================================================

        if (!members.length) {

            membersCard.innerHTML = `

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
        // CLEAR EXISTING MEMBERS
        // =====================================================

        membersCard.innerHTML = "";


        // =====================================================
        // RENDER MEMBERS
        // =====================================================

        members.forEach(
            (member) => {

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


                // ---------------------------------------------
                // MEMBER ROW
                // ---------------------------------------------

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "member-row";


                // ---------------------------------------------
                // AVATAR
                // ---------------------------------------------

                const avatar =
                    document.createElement(
                        "div"
                    );


                avatar.className =
                    "member-avatar large avatar-purple";


                if (profileImage) {

                    avatar.innerHTML = `

                    <img
                        src="${escapeHtml(profileImage)}"
                        alt="${escapeHtml(name)}"
                    >

                `;

                }

                else {

                    avatar.textContent =
                        initial;

                }


                // ---------------------------------------------
                // MEMBER DETAILS
                // ---------------------------------------------

                const details =
                    document.createElement(
                        "div"
                    );


                details.className =
                    "member-details";


                const memberName =
                    document.createElement(
                        "strong"
                    );


                memberName.textContent =
                    name;


                const memberEmail =
                    document.createElement(
                        "span"
                    );


                memberEmail.textContent =
                    email;


                details.appendChild(
                    memberName
                );


                details.appendChild(
                    memberEmail
                );


                // ---------------------------------------------
                // ROLE BADGE
                // ---------------------------------------------

                const roleBadge =
                    document.createElement(
                        "span"
                    );


                if (
                    role.toLowerCase() ===
                    "owner"
                ) {

                    roleBadge.className =
                        "owner-badge";

                    roleBadge.textContent =
                        "OWNER";

                }

                else {

                    roleBadge.className =
                        "member-badge";

                    roleBadge.textContent =
                        "MEMBER";

                }


                // ---------------------------------------------
                // BUILD ROW
                // ---------------------------------------------

                row.appendChild(
                    avatar
                );


                row.appendChild(
                    details
                );


                row.appendChild(
                    roleBadge
                );


                membersCard.appendChild(
                    row
                );

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


    async function loadInviteCode() {

        const inviteCodeElement =
            document.getElementById(
                "inviteCodeDisplay"
            ) ||
            document.querySelector(
                ".invite-code strong"
            );


        if (!inviteCodeElement) {
            return;
        }


        inviteCodeElement.textContent =
            "Loading...";


        try {

            const response =
                await api(
                    `/api/spaces/${spaceId}/invite-code`
                );


            if (!response) {
                return;
            }


            const result =
                await response.json().catch(
                    () => ({})
                );


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "Unable to load invite code."
                );

            }


            const inviteCode =
                result.data?.invite_code;


            if (!inviteCode) {

                throw new Error(
                    "Invite code was not returned."
                );

            }


            inviteCodeElement.textContent =
                inviteCode;

        }

        catch (error) {

            console.error(
                "Invite code loading error:",
                error
            );


            inviteCodeElement.textContent =
                "Unavailable";

        }

    }


    function openInviteModal() {

        if (!inviteModal) {
            return;
        }


        inviteModal.classList.add(
            "open"
        );


        inviteModal.setAttribute(
            "aria-hidden",
            "false"
        );


        loadInviteCode();

    }


    function closeInviteModal() {

        if (!inviteModal) {
            return;
        }


        inviteModal.classList.remove(
            "open"
        );


        inviteModal.setAttribute(
            "aria-hidden",
            "true"
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
                    document.getElementById(
                        "inviteCodeDisplay"
                    ) ||
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

        const inviteCodeElement =
            document.getElementById("inviteCodeDisplay") ||
            document.querySelector(".invite-code strong");

        let inviteCode =
            inviteCodeElement?.textContent.trim() || "";

        /*
         * If the invite code has not loaded yet, fetch it directly
         * so the Share button always shares the real code.
         */
        if (
            !inviteCode ||
            inviteCode === "Loading..." ||
            inviteCode === "Unavailable" ||
            inviteCode === "Unable to load"
        ) {

            try {

                const response = await api(
                    `/api/spaces/${spaceId}/invite-code`
                );

                if (response) {

                    const result =
                        await response.json().catch(
                            () => ({})
                        );

                    if (
                        response.ok &&
                        result.success &&
                        result.data?.invite_code
                    ) {

                        inviteCode =
                            result.data.invite_code;

                        if (inviteCodeElement) {

                            inviteCodeElement.textContent =
                                inviteCode;

                        }

                    }

                }

            }

            catch (error) {

                console.error(
                    "Invite code fetch for sharing failed:",
                    error
                );

            }

        }

        const shareText =
            inviteCode
                ? `Join my private everUS space.\\n\\nInvite code: ${inviteCode}`
                : "Join my private everUS space.";

        const shareData = {

            title: title,

            text: shareText,

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

                const fallbackText =
                    inviteCode
                        ? `${shareText}\\n\\nSpace: ${window.location.href}`
                        : window.location.href;

                await navigator.clipboard.writeText(
                    fallbackText
                );


                alert(
                    inviteCode
                        ? "Invite details copied!"
                        : "Space link copied!"
                );

            }

            catch {

                alert(
                    "Unable to copy invite details."
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
    // MEMORIES
    // =====================================================

    const memoryGallery =
        document.getElementById(
            "memoryGallery"
        );

    const memoryGalleryEmpty =
        document.getElementById(
            "memoryGalleryEmpty"
        );

    const memoryNavCount =
        document.getElementById(
            "memoryNavCount"
        );

    const memoryQuickCount =
        document.getElementById(
            "memoryQuickCount"
        );

    const memoryUploadModal =
        document.getElementById(
            "memoryUploadModal"
        );

    const memoryUploadForm =
        document.getElementById(
            "memoryUploadForm"
        );

    const memoryFileInput =
        document.getElementById(
            "memoryFileInput"
        );

    const memoryCaptionInput =
        document.getElementById(
            "memoryCaptionInput"
        );

    const memoryUploadPreview =
        document.getElementById(
            "memoryUploadPreview"
        );

    const memoryUploadMessage =
        document.getElementById(
            "memoryUploadMessage"
        );

    const submitMemoryUpload =
        document.getElementById(
            "submitMemoryUpload"
        );

    const addMemoryButton =
        document.getElementById(
            "addMemoryButton"
        );

    const uploadMemoryButton =
        document.getElementById(
            "uploadMemoryButton"
        );

    const closeMemoryUpload =
        document.getElementById(
            "closeMemoryUpload"
        );

    const cancelMemoryUpload =
        document.getElementById(
            "cancelMemoryUpload"
        );

    const allowedMemoryExtensions = new Set([
        "jpg", "jpeg", "png", "webp", "mp4", "webm"
    ]);

    let memoryPreviewUrl = null;
    let currentMemories = [];


    function updateMemoryCounts(count) {

        if (memoryNavCount) {

            memoryNavCount.textContent =
                String(count);

            memoryNavCount.title =
                `${count} ${count === 1
                    ? "memory"
                    : "memories"
                }`;

        }

        if (memoryQuickCount) {

            memoryQuickCount.textContent =
                String(count);

            memoryQuickCount.title =
                `${count} ${count === 1
                    ? "memory"
                    : "memories"
                }`;

        }

    }


    function setGalleryEmptyMessage(title, message) {

        if (!memoryGalleryEmpty) {
            return;
        }

        const titleElement =
            memoryGalleryEmpty.querySelector("h3");

        const messageElement =
            memoryGalleryEmpty.querySelector("p");

        if (titleElement) {

            titleElement.textContent = title;

        }

        if (messageElement) {

            messageElement.textContent = message;

        }

    }


    function safeMediaUrl(value) {

        try {

            const url = new URL(
                String(value || ""),
                window.location.origin
            );

            return ["http:", "https:"].includes(url.protocol)
                ? url.href
                : "";

        } catch {

            return "";

        }

    }


    function formatMemoryDate(value) {

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {

            return "Saved moment";

        }

        return date.toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    function renderMemories(memories) {

        currentMemories = Array.isArray(memories)
            ? memories
            : [];

        updateMemoryCounts(currentMemories.length);

        if (!memoryGallery || !memoryGalleryEmpty) {
            return;
        }

        memoryGallery.replaceChildren();

        if (currentMemories.length === 0) {

            memoryGallery.classList.add("hidden");
            memoryGalleryEmpty.classList.remove("hidden");
            setGalleryEmptyMessage(
                "No memories yet",
                "Upload your first photo or video and make this space yours."
            );
            return;

        }

        memoryGalleryEmpty.classList.add("hidden");
        memoryGallery.classList.remove("hidden");

        currentMemories.forEach(
            (memory) => {

                const card =
                    document.createElement("article");

                card.className = "memory-card";

                const mediaContainer =
                    document.createElement("div");

                mediaContainer.className = "memory-card-media";

                const url = safeMediaUrl(memory.url);

                if (url && memory.media_type === "video") {

                    const video =
                        document.createElement("video");

                    video.src = url;
                    video.controls = true;
                    video.preload = "metadata";
                    mediaContainer.appendChild(video);

                } else if (url && memory.media_type === "image") {

                    const image =
                        document.createElement("img");

                    image.src = url;
                    image.alt = memory.caption || "Space memory";
                    image.loading = "lazy";
                    mediaContainer.appendChild(image);

                } else {

                    const unavailable =
                        document.createElement("span");

                    unavailable.textContent =
                        "Media unavailable";

                    mediaContainer.appendChild(unavailable);

                }

                const content =
                    document.createElement("div");

                content.className = "memory-card-content";

                if (memory.caption) {

                    const caption =
                        document.createElement("p");

                    caption.className = "memory-card-caption";
                    caption.textContent = memory.caption;
                    content.appendChild(caption);

                }

                const meta =
                    document.createElement("div");

                meta.className = "memory-card-meta";

                const date =
                    document.createElement("span");

                date.textContent =
                    formatMemoryDate(memory.created_at);

                const deleteButton =
                    document.createElement("button");

                deleteButton.className =
                    "memory-delete-button";

                deleteButton.type = "button";
                deleteButton.title = "Delete memory";
                deleteButton.setAttribute(
                    "aria-label",
                    "Delete memory"
                );
                deleteButton.innerHTML =
                    '<i class="fa-solid fa-trash"></i>';

                if (typeof memory._id !== "string") {

                    deleteButton.disabled = true;

                } else {

                    deleteButton.addEventListener(
                        "click",
                        () => deleteMemory(
                            memory._id,
                            deleteButton
                        )
                    );

                }

                meta.appendChild(date);
                meta.appendChild(deleteButton);
                content.appendChild(meta);
                card.appendChild(mediaContainer);
                card.appendChild(content);
                memoryGallery.appendChild(card);

            }
        );

    }


    async function loadMemories() {

        if (!memoryGallery || !memoryGalleryEmpty) {
            return;
        }

        try {

            const response = await api(
                `/api/spaces/${spaceId}/memories`
            );

            if (!response) {
                return;
            }

            const result = await response.json().catch(
                () => ({})
            );

            if (!response.ok || !result.success) {

                if (response.status === 403) {

                    setGalleryEmptyMessage(
                        "Access denied",
                        "You do not have access to this space's memories."
                    );

                } else if (response.status === 404) {

                    setGalleryEmptyMessage(
                        "Memories unavailable",
                        "This space could not be found."
                    );

                } else {

                    setGalleryEmptyMessage(
                        "Unable to load memories",
                        "Please try again in a moment."
                    );

                }

                memoryGallery.classList.add("hidden");
                memoryGalleryEmpty.classList.remove("hidden");
                updateMemoryCounts(0);
                return;

            }

            renderMemories(result.data?.memories || []);

        } catch {

            memoryGallery.classList.add("hidden");
            memoryGalleryEmpty.classList.remove("hidden");
            setGalleryEmptyMessage(
                "Unable to load memories",
                "Check your connection and try again."
            );
            updateMemoryCounts(0);

        }

    }


    function clearMemoryPreview() {

        if (memoryPreviewUrl) {

            URL.revokeObjectURL(memoryPreviewUrl);
            memoryPreviewUrl = null;

        }

        if (memoryUploadPreview) {

            memoryUploadPreview.replaceChildren();
            memoryUploadPreview.classList.add("hidden");

        }

    }


    function closeMemoryUploadModal() {

        if (!memoryUploadModal) {
            return;
        }

        memoryUploadModal.classList.remove("open");
        memoryUploadModal.setAttribute("aria-hidden", "true");
        clearMemoryPreview();

        if (memoryUploadForm) {

            memoryUploadForm.reset();

        }

        if (memoryUploadMessage) {

            memoryUploadMessage.textContent = "";
            memoryUploadMessage.classList.remove("success");

        }

    }


    function openMemoryUploadModal() {

        if (!memoryUploadModal) {
            return;
        }

        memoryUploadModal.classList.add("open");
        memoryUploadModal.setAttribute("aria-hidden", "false");

    }


    function showMemoryPreview(file) {

        clearMemoryPreview();

        if (!file || !memoryUploadPreview) {
            return;
        }

        memoryPreviewUrl = URL.createObjectURL(file);

        const media = document.createElement(
            file.type.startsWith("video/")
                ? "video"
                : "img"
        );

        media.src = memoryPreviewUrl;

        if (media instanceof HTMLVideoElement) {

            media.controls = true;
            media.preload = "metadata";

        } else {

            media.alt = "Selected memory preview";

        }

        memoryUploadPreview.appendChild(media);
        memoryUploadPreview.classList.remove("hidden");

    }


    function setUploadMessage(message, isSuccess = false) {

        if (!memoryUploadMessage) {
            return;
        }

        memoryUploadMessage.textContent = message;
        memoryUploadMessage.classList.toggle(
            "success",
            isSuccess
        );

    }


    if (memoryFileInput) {

        memoryFileInput.addEventListener(
            "change",
            () => {

                const file = memoryFileInput.files[0];

                if (!file) {

                    clearMemoryPreview();
                    return;

                }

                const extension =
                    file.name.split(".").pop().toLowerCase();

                if (
                    !allowedMemoryExtensions.has(extension) ||
                    file.size > 100 * 1024 * 1024
                ) {

                    memoryFileInput.value = "";
                    clearMemoryPreview();
                    setUploadMessage(
                        "Choose a supported file up to 100 MB."
                    );
                    return;

                }

                setUploadMessage("");
                showMemoryPreview(file);

            }
        );

    }


    async function uploadMemory(event) {

        event.preventDefault();

        const file = memoryFileInput?.files[0];
        if (!file) {

            setUploadMessage("Choose a file before uploading.");
            return;

        }

        const formData = new FormData();
        formData.append("file", file);

        const caption = memoryCaptionInput?.value.trim();
        if (caption) {

            formData.append("caption", caption);

        }

        const originalButtonContent =
            submitMemoryUpload.innerHTML;

        submitMemoryUpload.disabled = true;
        submitMemoryUpload.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';
        setUploadMessage("");

        try {

            // api() detects FormData and sends only the Authorization header;
            // the browser sets the multipart boundary Content-Type.
            const response = await api(
                `/api/spaces/${spaceId}/memories`,
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response) {
                return;
            }

            const result = await response.json().catch(
                () => ({})
            );

            if (!response.ok || !result.success) {

                const messages = {
                    403: "You are not allowed to upload to this space.",
                    404: "This space could not be found.",
                    413: "This file is too large to upload."
                };

                setUploadMessage(
                    messages[response.status] ||
                    result.message ||
                    "Unable to upload this memory."
                );
                return;

            }

            setUploadMessage(
                "Memory uploaded successfully.",
                true
            );

            setTimeout(
                async () => {

                    closeMemoryUploadModal();
                    await loadMemories();

                },
                350
            );

        } catch {

            setUploadMessage(
                "Unable to reach the server. Please try again."
            );

        } finally {

            submitMemoryUpload.disabled = false;
            submitMemoryUpload.innerHTML =
                originalButtonContent;

        }

    }


    async function deleteMemory(memoryId, button) {

        if (!window.confirm("Delete this memory permanently?")) {
            return;
        }

        button.disabled = true;

        try {

            const response = await api(
                `/api/spaces/${spaceId}/memories/${memoryId}`,
                { method: "DELETE" }
            );

            if (!response) {
                return;
            }

            const result = await response.json().catch(
                () => ({})
            );

            if (!response.ok || !result.success) {

                if (response.status === 403) {

                    alert(
                        "You are not authorized to delete this memory."
                    );

                } else {

                    alert(
                        result.message ||
                        "Unable to delete this memory."
                    );

                }

                return;

            }

            renderMemories(
                currentMemories.filter(
                    (memory) => memory._id !== memoryId
                )
            );

        } catch {

            alert(
                "Unable to reach the server. Please try again."
            );

        } finally {

            button.disabled = false;

        }

    }


    [addMemoryButton, uploadMemoryButton].forEach(
        (button) => {

            if (button) {

                button.addEventListener(
                    "click",
                    openMemoryUploadModal
                );

            }

        }
    );

    if (memoryUploadForm) {

        memoryUploadForm.addEventListener(
            "submit",
            uploadMemory
        );

    }

    [closeMemoryUpload, cancelMemoryUpload].forEach(
        (button) => {

            if (button) {

                button.addEventListener(
                    "click",
                    closeMemoryUploadModal
                );

            }

        }
    );

    if (memoryUploadModal) {

        memoryUploadModal.addEventListener(
            "click",
            (event) => {

                if (event.target === memoryUploadModal) {

                    closeMemoryUploadModal();

                }

            }
        );

    }

    // =====================================================
    // JOURNAL
    // =====================================================

    const journalList =
        document.getElementById("journalList");

    const journalEmpty =
        document.getElementById("journalEmpty");

    const newJournalEntryButton =
        document.getElementById("newJournalEntryButton");

    const writeJournalButton =
        document.getElementById("writeJournalButton");

    const journalModal =
        document.getElementById("journalModal");

    const closeJournalModal =
        document.getElementById("closeJournalModal");

    const cancelJournalButton =
        document.getElementById("cancelJournalButton");

    const journalForm =
        document.getElementById("journalForm");

    const journalEntryId =
        document.getElementById("journalEntryId");

    const journalTitleInput =
        document.getElementById("journalTitleInput");

    const journalContentInput =
        document.getElementById("journalContentInput");

    const journalModalTitle =
        document.getElementById("journalModalTitle");

    const journalFormMessage =
        document.getElementById("journalFormMessage");

    const saveJournalButton =
        document.getElementById("saveJournalButton");

    let currentJournalEntries = [];


    function formatJournalDate(value) {

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Recently";
        }

        return date.toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );
    }


    function setJournalMessage(
        message,
        isSuccess = false
    ) {

        if (!journalFormMessage) {
            return;
        }

        journalFormMessage.textContent = message;

        journalFormMessage.classList.toggle(
            "success",
            isSuccess
        );
    }


    function openJournalModal(entry = null) {

        if (!journalModal) {
            return;
        }

        journalForm?.reset();

        setJournalMessage("");

        if (journalEntryId) {
            journalEntryId.value =
                entry?.id || "";
        }

        if (journalTitleInput) {
            journalTitleInput.value =
                entry?.title || "";
        }

        if (journalContentInput) {
            journalContentInput.value =
                entry?.content || "";
        }

        if (journalModalTitle) {

            journalModalTitle.textContent =
                entry
                    ? "Edit your entry."
                    : "Write something.";

        }

        if (saveJournalButton) {

            saveJournalButton.innerHTML =
                entry
                    ? '<i class="fa-solid fa-check"></i> Update entry'
                    : '<i class="fa-solid fa-check"></i> Save entry';

        }

        journalModal.classList.add("open");

        journalModal.setAttribute(
            "aria-hidden",
            "false"
        );

        journalTitleInput?.focus();
    }


    function closeJournalEntryModal() {

        if (!journalModal) {
            return;
        }

        journalModal.classList.remove("open");

        journalModal.setAttribute(
            "aria-hidden",
            "true"
        );

        journalForm?.reset();

        setJournalMessage("");
    }


    function renderJournal(entries) {

        currentJournalEntries =
            Array.isArray(entries)
                ? entries
                : [];

        if (!journalList || !journalEmpty) {
            return;
        }

        journalList.replaceChildren();

        if (currentJournalEntries.length === 0) {

            journalList.classList.add("hidden");

            journalEmpty.classList.remove(
                "hidden"
            );

            return;
        }

        journalEmpty.classList.add(
            "hidden"
        );

        journalList.classList.remove(
            "hidden"
        );


        currentJournalEntries.forEach(
            (entry) => {

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "journal-entry-card";


                const header =
                    document.createElement(
                        "div"
                    );

                header.className =
                    "journal-entry-header";


                const titleContainer =
                    document.createElement(
                        "div"
                    );


                const title =
                    document.createElement(
                        "h3"
                    );

                title.className =
                    "journal-entry-title";

                title.textContent =
                    entry.title ||
                    "Untitled entry";


                const date =
                    document.createElement(
                        "span"
                    );

                date.className =
                    "journal-entry-date";

                date.textContent =
                    formatJournalDate(
                        entry.created_at
                    );


                titleContainer.appendChild(title);
                titleContainer.appendChild(date);


                const actions =
                    document.createElement(
                        "div"
                    );

                actions.className =
                    "journal-entry-actions";


                const editButton =
                    document.createElement(
                        "button"
                    );

                editButton.type = "button";

                editButton.className =
                    "journal-entry-action";

                editButton.title =
                    "Edit entry";

                editButton.setAttribute(
                    "aria-label",
                    "Edit entry"
                );

                editButton.innerHTML =
                    '<i class="fa-solid fa-pen"></i>';


                editButton.addEventListener(
                    "click",
                    () => {

                        openJournalModal(
                            entry
                        );

                    }
                );


                const deleteButton =
                    document.createElement(
                        "button"
                    );

                deleteButton.type = "button";

                deleteButton.className =
                    "journal-entry-action delete";

                deleteButton.title =
                    "Delete entry";

                deleteButton.setAttribute(
                    "aria-label",
                    "Delete entry"
                );

                deleteButton.innerHTML =
                    '<i class="fa-solid fa-trash"></i>';


                deleteButton.addEventListener(
                    "click",
                    () => {

                        deleteJournalEntry(
                            entry.id,
                            deleteButton
                        );

                    }
                );


                actions.appendChild(
                    editButton
                );

                actions.appendChild(
                    deleteButton
                );


                header.appendChild(
                    titleContainer
                );

                header.appendChild(
                    actions
                );


                const content =
                    document.createElement(
                        "p"
                    );

                content.className =
                    "journal-entry-content";

                content.textContent =
                    entry.content || "";


                card.appendChild(header);

                card.appendChild(content);

                journalList.appendChild(card);

            }
        );
    }

    // =========================================================
    // MEMBERS
    // =========================================================

    async function loadMembers() {
        const membersList = document.getElementById("membersList");
        const membersEmpty = document.getElementById("membersEmpty");
        const memberCount = document.getElementById("memberCount");

        if (!membersList || !membersEmpty) {
            return;
        }

        try {
            const response = await fetch(
                `/api/spaces/${spaceId}/members`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to load members."
                );
            }

            const members =
                result.data?.members ||
                result.members ||
                [];

            membersList.innerHTML = "";

            if (members.length === 0) {
                membersList.classList.add("hidden");
                membersEmpty.classList.remove("hidden");

                if (memberCount) {
                    memberCount.textContent = "0 members";
                }

                return;
            }

            membersList.classList.remove("hidden");
            membersEmpty.classList.add("hidden");

            if (memberCount) {
                memberCount.textContent =
                    `${members.length} ${members.length === 1
                        ? "member"
                        : "members"
                    }`;
            }

            members.forEach((member) => {
                const row = document.createElement("div");
                row.className = "member-row";

                // Avatar
                const avatar = document.createElement("div");
                avatar.className =
                    "member-avatar large avatar-purple";

                if (member.profile_image) {
                    const image = document.createElement("img");

                    image.src = member.profile_image;
                    image.alt = member.name || "Member";
                    image.loading = "lazy";

                    avatar.textContent = "";
                    avatar.appendChild(image);
                } else {
                    const name =
                        member.name ||
                        member.email ||
                        "U";

                    avatar.textContent =
                        name.charAt(0).toUpperCase();
                }

                // Details
                const details = document.createElement("div");
                details.className = "member-details";

                const name = document.createElement("strong");
                name.textContent =
                    member.name ||
                    member.email ||
                    "Unknown User";

                const role = document.createElement("span");
                role.textContent =
                    member.role === "owner"
                        ? "Owner"
                        : "Member";

                details.appendChild(name);
                details.appendChild(role);

                row.appendChild(avatar);
                row.appendChild(details);

                // Owner badge
                if (member.role === "owner") {
                    const ownerBadge =
                        document.createElement("span");

                    ownerBadge.className = "owner-badge";
                    ownerBadge.textContent = "OWNER";

                    row.appendChild(ownerBadge);
                }

                membersList.appendChild(row);
            });

        } catch (error) {
            console.error(
                "Failed to load members:",
                error
            );

            membersList.innerHTML = "";

            membersList.classList.add("hidden");
            membersEmpty.classList.remove("hidden");

            if (memberCount) {
                memberCount.textContent = "Members";
            }
        }
    }

    async function loadJournal() {

        if (!journalList || !journalEmpty) {
            return;
        }

        try {

            const response =
                await api(
                    `/api/spaces/${spaceId}/journal`
                );

            if (!response) {
                return;
            }

            const result =
                await response.json().catch(
                    () => ({})
                );


            if (
                !response.ok ||
                !result.success
            ) {

                console.error(
                    "Journal load failed:",
                    result.message
                );

                return;
            }


            renderJournal(
                result.data?.entries || []
            );

        } catch (error) {

            console.error(
                "Journal loading error:",
                error
            );

        }
    }


    async function saveJournalEntry(event) {

        event.preventDefault();

        const title =
            journalTitleInput?.value.trim();

        const content =
            journalContentInput?.value.trim();

        const entryId =
            journalEntryId?.value.trim();


        if (!title) {

            setJournalMessage(
                "Please enter a title."
            );

            journalTitleInput?.focus();

            return;
        }


        if (!content) {

            setJournalMessage(
                "Please write something."
            );

            journalContentInput?.focus();

            return;
        }


        saveJournalButton.disabled =
            true;


        const originalButtonContent =
            saveJournalButton.innerHTML;


        saveJournalButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';


        setJournalMessage("");


        try {

            const isEditing =
                Boolean(entryId);


            const url =
                isEditing
                    ? `/api/spaces/${spaceId}/journal/${entryId}`
                    : `/api/spaces/${spaceId}/journal`;


            const response =
                await api(
                    url,
                    {
                        method:
                            isEditing
                                ? "PUT"
                                : "POST",

                        body:
                            JSON.stringify({
                                title,
                                content
                            })
                    }
                );


            if (!response) {
                return;
            }


            const result =
                await response.json().catch(
                    () => ({})
                );


            if (
                !response.ok ||
                !result.success
            ) {

                setJournalMessage(
                    result.message ||
                    "Unable to save journal entry."
                );

                return;
            }


            setJournalMessage(
                isEditing
                    ? "Entry updated successfully."
                    : "Entry saved successfully.",
                true
            );


            setTimeout(
                async () => {

                    closeJournalEntryModal();

                    await loadJournal();

                },
                350
            );


        } catch (error) {

            console.error(
                "Journal save error:",
                error
            );

            setJournalMessage(
                "Unable to reach the server. Please try again."
            );

        } finally {

            saveJournalButton.disabled =
                false;

            saveJournalButton.innerHTML =
                originalButtonContent;

        }
    }


    async function deleteJournalEntry(
        entryId,
        button
    ) {

        if (
            !window.confirm(
                "Delete this journal entry permanently?"
            )
        ) {
            return;
        }


        button.disabled = true;


        try {

            const response =
                await api(
                    `/api/spaces/${spaceId}/journal/${entryId}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response) {
                return;
            }


            const result =
                await response.json().catch(
                    () => ({})
                );


            if (
                !response.ok ||
                !result.success
            ) {

                alert(
                    result.message ||
                    "Unable to delete journal entry."
                );

                return;
            }


            currentJournalEntries =
                currentJournalEntries.filter(
                    (entry) =>
                        entry.id !== entryId
                );


            renderJournal(
                currentJournalEntries
            );


        } catch (error) {

            console.error(
                "Journal delete error:",
                error
            );

            alert(
                "Unable to reach the server. Please try again."
            );

        } finally {

            button.disabled = false;

        }
    }


    [
        newJournalEntryButton,
        writeJournalButton
    ].forEach(
        (button) => {

            if (button) {

                button.addEventListener(
                    "click",
                    () => openJournalModal()
                );

            }

        }
    );


    if (closeJournalModal) {

        closeJournalModal.addEventListener(
            "click",
            closeJournalEntryModal
        );

    }


    if (cancelJournalButton) {

        cancelJournalButton.addEventListener(
            "click",
            closeJournalEntryModal
        );

    }


    if (journalModal) {

        journalModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    journalModal
                ) {

                    closeJournalEntryModal();

                }

            }
        );

    }


    if (journalForm) {

        journalForm.addEventListener(
            "submit",
            saveJournalEntry
        );

    }

    // =====================================================
    // TIMELINE
    // =====================================================

    const timelineList = document.getElementById("timelineList");
    const timelineEmpty = document.getElementById("timelineEmpty");
    const newTimelineEventButton = document.getElementById("newTimelineEventButton");
    const timelineModal = document.getElementById("timelineModal");
    const closeTimelineModal = document.getElementById("closeTimelineModal");
    const cancelTimelineButton = document.getElementById("cancelTimelineButton");
    const timelineForm = document.getElementById("timelineForm");
    const timelineEventId = document.getElementById("timelineEventId");
    const timelineTitleInput = document.getElementById("timelineTitleInput");
    const timelineDescriptionInput = document.getElementById("timelineDescriptionInput");
    const timelineDateInput = document.getElementById("timelineDateInput");
    const timelineModalTitle = document.getElementById("timelineModalTitle");
    const timelineFormMessage = document.getElementById("timelineFormMessage");
    const saveTimelineButton = document.getElementById("saveTimelineButton");
    const timelineQuickCount = document.getElementById("timelineQuickCount");

    let currentTimelineEvents = [];

    function formatTimelineDate(value) {
        if (!value) return "Date unavailable";
        const raw = String(value).slice(0, 10);
        const parts = raw.split("-");
        if (parts.length === 3) {
            const localDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            if (!Number.isNaN(localDate.getTime())) {
                return localDate.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                });
            }
        }
        return raw;
    }

    function setTimelineMessage(message, isSuccess = false) {
        if (!timelineFormMessage) return;
        timelineFormMessage.textContent = message;
        timelineFormMessage.classList.toggle("success", isSuccess);
    }

    function openTimelineModal(timelineEvent = null) {
        if (!timelineModal) return;
        timelineForm?.reset();
        setTimelineMessage("");
        if (timelineEventId) timelineEventId.value = timelineEvent?.id || "";
        if (timelineTitleInput) timelineTitleInput.value = timelineEvent?.title || "";
        if (timelineDescriptionInput) timelineDescriptionInput.value = timelineEvent?.description || "";
        if (timelineDateInput) timelineDateInput.value = timelineEvent?.event_date ? String(timelineEvent.event_date).slice(0, 10) : "";
        if (timelineModalTitle) timelineModalTitle.textContent = timelineEvent ? "Edit your event." : "Add an event.";
        if (saveTimelineButton) saveTimelineButton.innerHTML = timelineEvent ? '<i class="fa-solid fa-check"></i> Update event' : '<i class="fa-solid fa-check"></i> Save event';
        timelineModal.classList.add("open");
        timelineModal.setAttribute("aria-hidden", "false");
        timelineTitleInput?.focus();
    }

    function closeTimelineEventModal() {
        if (!timelineModal) return;
        timelineModal.classList.remove("open");
        timelineModal.setAttribute("aria-hidden", "true");
        timelineForm?.reset();
        if (timelineEventId) timelineEventId.value = "";
        setTimelineMessage("");
    }

    function renderTimeline(events) {
        currentTimelineEvents = Array.isArray(events) ? events : [];
        if (timelineQuickCount) timelineQuickCount.textContent = currentTimelineEvents.length;
        if (!timelineList || !timelineEmpty) return;
        timelineList.replaceChildren();
        if (currentTimelineEvents.length === 0) {
            timelineList.classList.add("hidden");
            timelineEmpty.classList.remove("hidden");
            return;
        }
        timelineEmpty.classList.add("hidden");
        timelineList.classList.remove("hidden");
        currentTimelineEvents.forEach((timelineEvent) => {
            const card = document.createElement("article");
            card.className = "timeline-event-card";
            const dot = document.createElement("div");
            dot.className = "timeline-event-dot";
            dot.innerHTML = '<i class="fa-solid fa-star"></i>';
            const body = document.createElement("div");
            body.className = "timeline-event-body";
            const header = document.createElement("div");
            header.className = "timeline-event-header";
            const titleWrap = document.createElement("div");
            const title = document.createElement("h3");
            title.className = "timeline-event-title";
            title.textContent = timelineEvent.title || "Untitled event";
            const date = document.createElement("span");
            date.className = "timeline-event-date";
            date.textContent = formatTimelineDate(timelineEvent.event_date);
            titleWrap.append(title, date);
            const actions = document.createElement("div");
            actions.className = "timeline-event-actions";
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "timeline-event-action";
            editButton.title = "Edit event";
            editButton.setAttribute("aria-label", "Edit timeline event");
            editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
            editButton.addEventListener("click", () => openTimelineModal(timelineEvent));
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "timeline-event-action delete";
            deleteButton.title = "Delete event";
            deleteButton.setAttribute("aria-label", "Delete timeline event");
            deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteButton.addEventListener("click", () => deleteTimelineEvent(timelineEvent.id, deleteButton));
            actions.append(editButton, deleteButton);
            header.append(titleWrap, actions);
            body.appendChild(header);
            if (timelineEvent.description) {
                const description = document.createElement("p");
                description.className = "timeline-event-description";
                description.textContent = timelineEvent.description;
                body.appendChild(description);
            }
            card.append(dot, body);
            timelineList.appendChild(card);
        });
    }

    async function loadTimeline() {
        if (!timelineList || !timelineEmpty) return;
        try {
            const response = await api(`/api/spaces/${spaceId}/timeline`);
            if (!response) return;
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) {
                console.error("Timeline load failed:", result.message);
                return;
            }
            renderTimeline(result.data?.events || []);
        } catch (error) {
            console.error("Timeline loading error:", error);
        }
    }

    async function saveTimelineEvent(submitEvent) {
        submitEvent.preventDefault();
        const title = timelineTitleInput?.value.trim();
        const description = timelineDescriptionInput?.value.trim() || "";
        const eventDate = timelineDateInput?.value.trim();
        const eventId = timelineEventId?.value.trim();
        if (!title) {
            setTimelineMessage("Please enter a title.");
            timelineTitleInput?.focus();
            return;
        }
        if (!eventDate) {
            setTimelineMessage("Please select a date.");
            timelineDateInput?.focus();
            return;
        }
        if (!saveTimelineButton) return;
        const originalButtonContent = saveTimelineButton.innerHTML;
        saveTimelineButton.disabled = true;
        saveTimelineButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
        setTimelineMessage("");
        try {
            const isEditing = Boolean(eventId);
            const response = await api(
                isEditing ? `/api/spaces/${spaceId}/timeline/${eventId}` : `/api/spaces/${spaceId}/timeline`,
                {
                    method: isEditing ? "PUT" : "POST",
                    body: JSON.stringify({ title, description, event_date: eventDate })
                }
            );
            if (!response) return;
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) {
                setTimelineMessage(result.message || "Unable to save timeline event.");
                return;
            }
            closeTimelineEventModal();
            await loadTimeline();
        } catch (error) {
            console.error("Timeline save error:", error);
            setTimelineMessage("Unable to reach the server. Please try again.");
        } finally {
            saveTimelineButton.disabled = false;
            saveTimelineButton.innerHTML = originalButtonContent;
        }
    }

    async function deleteTimelineEvent(eventId, button) {
        if (!window.confirm("Delete this timeline event permanently?")) return;
        button.disabled = true;
        try {
            const response = await api(`/api/spaces/${spaceId}/timeline/${eventId}`, { method: "DELETE" });
            if (!response) return;
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) {
                alert(result.message || "Unable to delete timeline event.");
                return;
            }
            await loadTimeline();
        } catch (error) {
            console.error("Timeline delete error:", error);
            alert("Unable to reach the server. Please try again.");
        } finally {
            button.disabled = false;
        }
    }

    newTimelineEventButton?.addEventListener("click", () => openTimelineModal());
    closeTimelineModal?.addEventListener("click", closeTimelineEventModal);
    cancelTimelineButton?.addEventListener("click", closeTimelineEventModal);
    timelineModal?.addEventListener("click", (clickEvent) => {
        if (clickEvent.target === timelineModal) closeTimelineEventModal();
    });
    timelineForm?.addEventListener("submit", saveTimelineEvent);

    // =========================================================
    // INVITE CODE
    // =========================================================

    async function loadInviteCode() {
        const inviteCodeDisplay =
            document.getElementById("inviteCodeDisplay");

        if (!inviteCodeDisplay) {
            return;
        }

        try {
            const response = await fetch(
                `/api/spaces/${spaceId}/invite-code`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to load invite code."
                );
            }

            inviteCodeDisplay.textContent =
                result.data.invite_code;

        } catch (error) {
            console.error(
                "Failed to load invite code:",
                error
            );

            inviteCodeDisplay.textContent =
                "Unable to load";
        }
    }

    // =====================================================
    // MESSAGES
    // =====================================================

    const messagesList = document.getElementById("messagesList");
    const messagesEmpty = document.getElementById("messagesEmpty");
    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("messageInput");
    const sendMessageButton = document.getElementById("sendMessageButton");
    const messageImageInput = document.getElementById("messageImageInput");
    const attachMessageImage = document.getElementById("attachMessageImage");
    const messageImagePreview = document.getElementById("messageImagePreview");
    const messageFormMessage = document.getElementById("messageFormMessage");
    const messagesQuickCount = document.getElementById("messagesQuickCount");
    const messagesNavCount = document.getElementById("messagesNavCount");

    let currentMessages = [];
    let messageMembers = [];
    let editingMessageId = null;

    function setMessageFormMessage(message, isSuccess = false) {
        if (!messageFormMessage) return;
        messageFormMessage.textContent = message;
        messageFormMessage.classList.toggle("success", isSuccess);
    }

    function getCurrentUserId() {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            return String(user?._id || user?.id || "");
        } catch {
            return "";
        }
    }

    function formatMessageDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return date.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    }

    function updateMessageCounts(count) {
        if (messagesQuickCount) messagesQuickCount.textContent = String(count);
        if (messagesNavCount) messagesNavCount.textContent = String(count);
    }

    function getMemberForMessage(message) {
        const senderId = String(message.sender_id || "");
        return messageMembers.find(
            member => String(member.user_id || member.id || "") === senderId
        );
    }

    function renderMessages(messages) {
        currentMessages = Array.isArray(messages) ? messages : [];
        updateMessageCounts(currentMessages.length);

        if (!messagesList || !messagesEmpty) return;

        messagesList.replaceChildren();

        if (currentMessages.length === 0) {
            messagesList.classList.add("hidden");
            messagesEmpty.classList.remove("hidden");
            return;
        }

        messagesList.classList.remove("hidden");
        messagesEmpty.classList.add("hidden");

        const currentUserId = getCurrentUserId();

        currentMessages.forEach(message => {
            const senderId = String(message.sender_id || "");
            const mine = senderId === currentUserId;
            const member = getMemberForMessage(message);
            const senderName = member?.name || (mine ? "You" : "Member");
            const profileImage = member?.profile_image || "";

            const row = document.createElement("article");
            row.className = `message-row ${mine ? "mine" : "theirs"}`;
            row.dataset.messageId = message._id || message.id || "";

            const avatar = document.createElement("div");
            avatar.className = "message-avatar";

            if (profileImage) {
                const img = document.createElement("img");
                img.src = profileImage;
                img.alt = senderName;
                img.loading = "lazy";
                avatar.appendChild(img);
            } else {
                avatar.textContent = senderName.charAt(0).toUpperCase() || "U";
            }

            const bubbleWrap = document.createElement("div");
            bubbleWrap.className = "message-bubble-wrap";

            const meta = document.createElement("div");
            meta.className = "message-meta";

            const sender = document.createElement("strong");
            sender.textContent = mine ? "You" : senderName;

            const time = document.createElement("span");
            time.textContent = formatMessageDate(message.created_at);

            meta.append(sender, time);

            const bubble = document.createElement("div");
            bubble.className = "message-bubble";

            if (message.message_type === "image") {
                const image = document.createElement("img");
                image.src = safeMediaUrl(message.message);
                image.alt = "Shared image";
                image.loading = "lazy";
                image.className = "message-image";
                bubble.appendChild(image);
            } else {
                const content = document.createElement("p");
                content.textContent = message.message || "";
                bubble.appendChild(content);
            }

            if (message.is_edited) {
                const edited = document.createElement("small");
                edited.className = "message-edited";
                edited.textContent = "edited";
                bubble.appendChild(edited);
            }

            if (mine && message.message_type === "text") {
                const actions = document.createElement("div");
                actions.className = "message-actions";

                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.title = "Edit message";
                editButton.setAttribute("aria-label", "Edit message");
                editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
                editButton.addEventListener("click", () => beginEditMessage(message));

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.title = "Delete message";
                deleteButton.setAttribute("aria-label", "Delete message");
                deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
                deleteButton.addEventListener(
                    "click",
                    () => deleteSpaceMessage(message._id || message.id, deleteButton)
                );

                actions.append(editButton, deleteButton);
                bubble.appendChild(actions);
            }

            bubbleWrap.append(meta, bubble);

            if (mine) {
                row.append(bubbleWrap, avatar);
            } else {
                row.append(avatar, bubbleWrap);
            }

            messagesList.appendChild(row);
        });

        messagesList.scrollTop = messagesList.scrollHeight;
    }

    async function loadMessageMembers() {
        try {
            const response = await api(`/api/spaces/${spaceId}/members`);
            if (!response) return;
            const result = await response.json().catch(() => ({}));
            if (response.ok && result.success) {
                messageMembers = Array.isArray(result.data?.members)
                    ? result.data.members
                    : [];
            }
        } catch (error) {
            console.error("Message member loading error:", error);
        }
    }

    async function loadMessages() {
        if (!messagesList || !messagesEmpty) return;

        try {
            const response = await api(`/api/messages/${spaceId}`);
            if (!response) return;

            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.success) {
                console.error("Messages load failed:", result.message);
                return;
            }

            renderMessages(result.data?.messages || []);
        } catch (error) {
            console.error("Messages loading error:", error);
        }
    }

    async function sendTextMessage(event) {
        event.preventDefault();

        if (!messageInput || !sendMessageButton) return;

        const message = messageInput.value.trim();

        if (!message) {
            setMessageFormMessage("Write a message first.");
            messageInput.focus();
            return;
        }

        if (message.length > 5000) {
            setMessageFormMessage("Message cannot be longer than 5000 characters.");
            return;
        }

        const isEditing = Boolean(editingMessageId);
        const originalButton = sendMessageButton.innerHTML;

        sendMessageButton.disabled = true;
        sendMessageButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i>';

        try {
            const response = await api(
                isEditing
                    ? `/api/messages/${editingMessageId}`
                    : "/api/messages/",
                {
                    method: isEditing ? "PUT" : "POST",
                    body: JSON.stringify(
                        isEditing
                            ? { message }
                            : { space_id: spaceId, message }
                    )
                }
            );

            if (!response) return;

            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.success) {
                setMessageFormMessage(
                    result.message || "Unable to send message."
                );
                return;
            }

            messageInput.value = "";
            editingMessageId = null;
            setMessageFormMessage("");
            updateMessageComposerState();
            await loadMessages();
        } catch (error) {
            console.error("Message send error:", error);
            setMessageFormMessage("Unable to reach the server. Please try again.");
        } finally {
            sendMessageButton.disabled = false;
            sendMessageButton.innerHTML = originalButton;
        }
    }

    function beginEditMessage(message) {
        if (!messageInput) return;

        editingMessageId = message._id || message.id || null;
        messageInput.value = message.message || "";
        messageInput.focus();
        updateMessageComposerState();
    }

    function updateMessageComposerState() {
        if (!sendMessageButton) return;

        sendMessageButton.innerHTML = editingMessageId
            ? '<i class="fa-solid fa-check"></i>'
            : '<i class="fa-solid fa-paper-plane"></i>';

        sendMessageButton.title = editingMessageId
            ? "Update message"
            : "Send message";
    }

    async function deleteSpaceMessage(messageId, button) {
        if (!messageId) return;

        if (!window.confirm("Delete this message permanently?")) return;

        button.disabled = true;

        try {
            const response = await api(
                `/api/messages/${messageId}`,
                { method: "DELETE" }
            );

            if (!response) return;

            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.success) {
                alert(result.message || "Unable to delete message.");
                return;
            }

            await loadMessages();
        } catch (error) {
            console.error("Message delete error:", error);
            alert("Unable to reach the server. Please try again.");
        } finally {
            button.disabled = false;
        }
    }

    function clearMessageImagePreview() {
        if (!messageImagePreview) return;
        messageImagePreview.replaceChildren();
        messageImagePreview.classList.add("hidden");
    }

    if (messageImageInput) {
        messageImageInput.addEventListener("change", () => {
            const file = messageImageInput.files?.[0];

            if (!file) {
                clearMessageImagePreview();
                return;
            }

            if (!file.type.startsWith("image/")) {
                messageImageInput.value = "";
                clearMessageImagePreview();
                setMessageFormMessage("Choose an image file.");
                return;
            }

            const previewUrl = URL.createObjectURL(file);
            const image = document.createElement("img");
            image.src = previewUrl;
            image.alt = "Image preview";
            image.onload = () => URL.revokeObjectURL(previewUrl);

            messageImagePreview.replaceChildren(image);
            messageImagePreview.classList.remove("hidden");
            setMessageFormMessage("");
        });
    }

    async function sendImageMessage() {
        const file = messageImageInput?.files?.[0];

        if (!file) {
            setMessageFormMessage("Choose an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("space_id", spaceId);
        formData.append("image", file);

        try {
            if (sendMessageButton) {
                sendMessageButton.disabled = true;
                sendMessageButton.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i>';
            }

            const response = await api(
                "/api/messages/image",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response) return;

            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.success) {
                setMessageFormMessage(
                    result.message || "Unable to send image."
                );
                return;
            }

            messageImageInput.value = "";
            clearMessageImagePreview();
            setMessageFormMessage("");
            await loadMessages();
        } catch (error) {
            console.error("Image message error:", error);
            setMessageFormMessage("Unable to reach the server. Please try again.");
        } finally {
            updateMessageComposerState();
            if (sendMessageButton) sendMessageButton.disabled = false;
        }
    }

    if (messageForm) {
        messageForm.addEventListener("submit", event => {
            if (messageImageInput?.files?.length) {
                event.preventDefault();
                sendImageMessage();
                return;
            }
            sendTextMessage(event);
        });
    }

    attachMessageImage?.addEventListener("click", () => {
        messageImageInput?.click();
    });

    // Optional Socket.IO live updates. REST remains the source of truth.
    try {
        if (typeof io === "function") {
            const messageSocket = io();

            messageSocket.on("connect", () => {
                console.log("Messages socket connected.");
            });

            messageSocket.on("new_message", event => {
                if (String(event?.space_id) !== String(spaceId)) return;
                loadMessages();
            });
        }
    } catch (error) {
        console.warn("Live message socket unavailable:", error);
    }

    // =====================================================
    // INITIAL API LOAD
    // =====================================================

    loadSpace();
    loadMembers();
    loadMessageMembers();
    loadMessages();
    loadMemories();
    loadTimeline();
    loadJournal();
    loadInviteCode();
});
