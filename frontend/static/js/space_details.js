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
                {method: "DELETE"}
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
    // INITIAL API LOAD
    // =====================================================

    loadSpace();

    loadMembers();

    loadMemories();

});
