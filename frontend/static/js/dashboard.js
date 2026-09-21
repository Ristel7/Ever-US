document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       AUTH
    ========================================================= */

    const token = localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "/login";
        return;
    }


    /* =========================================================
       USER
    ========================================================= */

    let user = {};

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
    } catch (error) {
        console.warn("Unable to read user:", error);
    }

    const userName =
        user.name ||
        user.username ||
        "there";

    const userEmail =
        user.email ||
        "Account";


    /* =========================================================
       DOM HELPERS
    ========================================================= */

    const $ = (id) =>
        document.getElementById(id);


    const welcomeName =
        $("welcomeName");

    const sideName =
        $("sideName");

    const sideEmail =
        $("sideEmail");

    const avatar =
        $("avatar");

    const spacesContainer =
        $("spaces");

    const totalSpaces =
        $("totalSpaces");

    const totalMemories =
        $("totalMemories");

    const totalPeople =
        $("totalPeople");

    const storageUsed =
        $("storageUsed");

    const storageLimit =
        $("storageLimit");

    const recentMemoryList =
        $("recentMemoryList");

    const recentMemoriesEmpty =
        $("recentMemoriesEmpty");

    const activityList =
        $("activityList");

    const activityEmpty =
        $("activityEmpty");

    const viewAllSpaces =
        $("viewAllSpaces");


    /* =========================================================
       USER UI
    ========================================================= */

    if (welcomeName) {
        welcomeName.textContent = userName;
    }

    if (sideName) {
        sideName.textContent = userName;
    }

    if (sideEmail) {
        sideEmail.textContent = userEmail;
    }

    if (avatar) {
        avatar.textContent =
            userName
                .charAt(0)
                .toUpperCase();
    }


    /* =========================================================
       HTML ESCAPE
    ========================================================= */

    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =========================================================
       API HELPER
    ========================================================= */

    async function api(url, options = {}) {

        const headers = {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`
        };


        /*
         * Only add JSON content type when a body exists.
         * This prevents unnecessary content-type headers
         * on GET requests.
         */
        if (options.body) {

            headers["Content-Type"] =
                "application/json";

        }


        const response =
            await fetch(url, {
                ...options,
                headers
            });


        if (response.status === 401) {

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "is_logged_in"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "/login";

            return null;
        }


        return response;

    }


    /* =========================================================
       SPACE TYPE
    ========================================================= */

    function formatSpaceType(value) {

        if (!value) {
            return "Private";
        }

        return String(value)
            .charAt(0)
            .toUpperCase() +
            String(value).slice(1);

    }


    /* =========================================================
       GET SPACE ID
    ========================================================= */

    function getSpaceId(space) {

        return (
            space?._id ||
            space?.id ||
            space?.space_id ||
            null
        );

    }


    /* =========================================================
       CREATE SPACE CARD
    ========================================================= */

    function createSpaceCard(space) {

        const element =
            document.createElement("article");

        element.className =
            "space";

        const spaceId =
            getSpaceId(space);


        element.dataset.spaceId =
            spaceId || "";


        const name =
            space.space_name ||
            space.name ||
            "Untitled Space";


        const type =
            formatSpaceType(
                space.space_type ||
                space.type
            );


        const cover =
            space.cover_image || "";


        element.innerHTML = `
            <div class="cover">

                ${cover
                ? `
                            <img
                                src="${escapeHTML(cover)}"
                                alt="${escapeHTML(name)}"
                            >
                          `
                : `
                            <div class="space-cover-placeholder">
                                <i class="fa-solid fa-heart"></i>
                            </div>
                          `
            }

                <span class="type">
                    ${escapeHTML(type)}
                </span>

            </div>

            <div class="space-body">

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <div class="meta">

                    <span>
                        <i class="fa-regular fa-images"></i>
                        <span class="space-memory-count">
                            0 memories
                        </span>
                    </span>

                    <span>
                        <i class="fa-solid fa-lock"></i>
                    </span>

                </div>

            </div>
        `;


        if (spaceId) {

            element.style.cursor =
                "pointer";


            element.addEventListener(
                "click",
                () => {

                    window.location.href =
                        `/spaces/${encodeURIComponent(
                            String(spaceId)
                        )}`;

                }
            );

        }


        return element;

    }


    /* =========================================================
       LOAD SPACES
    ========================================================= */

    async function loadSpaces() {

        if (!spacesContainer) {
            return [];
        }


        spacesContainer.innerHTML = `
            <div class="loading">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>
                    Loading your spaces...
                </span>
            </div>
        `;


        try {

            const response =
                await api("/api/spaces/");


            if (!response) {
                return [];
            }


            const result =
                await response
                    .json()
                    .catch(() => ({}));


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "Unable to load spaces."
                );

            }


            const spaces =
                Array.isArray(
                    result.data?.spaces
                )
                    ? result.data.spaces
                    : [];


            if (totalSpaces) {

                totalSpaces.textContent =
                    spaces.length;

            }


            if (!spaces.length) {

                spacesContainer.innerHTML = `
                    <div class="loading">
                        <i class="fa-solid fa-layer-group"></i>

                        <span>
                            No spaces yet.
                            Create your first space above.
                        </span>
                    </div>
                `;

                return [];

            }


            spacesContainer.innerHTML =
                "";


            /*
             * IMPORTANT:
             * Do not use .slice(0, 4) or .slice(0, 6).
             * The dashboard should show ALL spaces.
             */
            spaces.forEach(
                (space) => {

                    spacesContainer.appendChild(
                        createSpaceCard(space)
                    );

                }
            );


            return spaces;

        } catch (error) {

            console.error(
                "Unable to load spaces:",
                error
            );


            spacesContainer.innerHTML = `
                <div class="loading">
                    <i class="fa-solid fa-triangle-exclamation"></i>

                    <span>
                        Could not load spaces.
                        Refresh and try again.
                    </span>
                </div>
            `;


            return [];

        }

    }


    /* =========================================================
       GET ALL SPACES
    ========================================================= */

    async function getAllSpaces() {

        try {

            const response =
                await api("/api/spaces/");


            if (!response) {
                return [];
            }


            if (!response.ok) {
                return [];
            }


            const result =
                await response
                    .json()
                    .catch(() => ({}));


            return Array.isArray(
                result.data?.spaces
            )
                ? result.data.spaces
                : [];


        } catch (error) {

            console.error(
                "Unable to fetch spaces:",
                error
            );

            return [];

        }

    }


    /* =========================================================
       GET FIRST SPACE ID
    ========================================================= */

    async function getFirstSpaceId() {

        const spaces =
            await getAllSpaces();


        if (!spaces.length) {
            return null;
        }


        return getSpaceId(
            spaces[0]
        );

    }


    /* =========================================================
       LOAD SPACE COUNTS
    ========================================================= */

    async function loadSpaceCounts(spaces) {

        if (!Array.isArray(spaces)) {
            return;
        }


        let memoriesCount = 0;
        let peopleCount = 0;


        const results =
            await Promise.allSettled(

                spaces.map(
                    async (space) => {

                        const spaceId =
                            getSpaceId(space);


                        if (!spaceId) {

                            return {
                                memories: 0,
                                people: 0
                            };

                        }


                        let memories = 0;
                        let people = 0;


                        /*
                         * MEMORIES
                         */

                        try {

                            const response =
                                await api(
                                    `/api/spaces/${encodeURIComponent(
                                        String(spaceId)
                                    )}/memories`
                                );


                            if (response?.ok) {

                                const result =
                                    await response
                                        .json()
                                        .catch(
                                            () => ({})
                                        );


                                const list =
                                    result.data?.memories;


                                if (
                                    Array.isArray(
                                        list
                                    )
                                ) {

                                    memories =
                                        list.length;

                                }

                            }

                        } catch (error) {

                            console.warn(
                                "Unable to load memories:",
                                error
                            );

                        }


                        /*
                         * MEMBERS
                         */

                        try {

                            const response =
                                await api(
                                    `/api/spaces/${encodeURIComponent(
                                        String(spaceId)
                                    )}/members`
                                );


                            if (response?.ok) {

                                const result =
                                    await response
                                        .json()
                                        .catch(
                                            () => ({})
                                        );


                                const list =
                                    result.data?.members;


                                if (
                                    Array.isArray(
                                        list
                                    )
                                ) {

                                    people =
                                        list.length;

                                }

                            }

                        } catch (error) {

                            console.warn(
                                "Unable to load members:",
                                error
                            );

                        }


                        return {
                            memories,
                            people
                        };

                    }
                )
            );


        results.forEach(
            (result) => {

                if (
                    result.status !==
                    "fulfilled"
                ) {
                    return;
                }


                memoriesCount +=
                    result.value.memories || 0;


                peopleCount +=
                    result.value.people || 0;

            }
        );


        if (totalMemories) {

            totalMemories.textContent =
                memoriesCount;

        }


        if (totalPeople) {

            totalPeople.textContent =
                peopleCount;

        }

    }


    /* =========================================================
       LOAD RECENT MEMORIES
    ========================================================= */

    async function loadRecentMemories(spaces) {

        if (
            !recentMemoryList ||
            !recentMemoriesEmpty
        ) {
            return [];
        }


        const allMemories = [];


        if (!Array.isArray(spaces)) {
            spaces = [];
        }


        /*
         * Load memories from every space.
         */

        await Promise.allSettled(

            spaces.map(
                async (space) => {

                    const spaceId =
                        getSpaceId(space);


                    if (!spaceId) {
                        return;
                    }


                    try {

                        const response =
                            await api(
                                `/api/spaces/${encodeURIComponent(
                                    String(spaceId)
                                )}/memories`
                            );


                        if (!response?.ok) {
                            return;
                        }


                        const result =
                            await response
                                .json()
                                .catch(
                                    () => ({})
                                );


                        const memories =
                            result.data?.memories;


                        if (
                            !Array.isArray(
                                memories
                            )
                        ) {
                            return;
                        }


                        memories.forEach(
                            (memory) => {

                                allMemories.push({

                                    ...memory,

                                    space_id:
                                        spaceId,

                                    space_name:
                                        space.space_name ||
                                        space.name ||
                                        "Untitled Space"

                                });

                            }
                        );

                    } catch (error) {

                        console.warn(
                            "Unable to load memories for space:",
                            spaceId,
                            error
                        );

                    }

                }
            )

        );


        /*
         * Sort newest first.
         */

        allMemories.sort(
            (a, b) => {

                const aDate =
                    new Date(
                        a.created_at ||
                        a.uploaded_at ||
                        a.updated_at ||
                        0
                    ).getTime();


                const bDate =
                    new Date(
                        b.created_at ||
                        b.uploaded_at ||
                        b.updated_at ||
                        0
                    ).getTime();


                return bDate - aDate;

            }
        );


        /*
         * Keep dashboard preview limited.
         * "View all" opens the Memories page.
         */

        const recent =
            allMemories.slice(0, 6);


        if (!recent.length) {

            recentMemoryList.innerHTML =
                "";


            recentMemoriesEmpty.style.display =
                "flex";


            return allMemories;

        }


        recentMemoriesEmpty.style.display =
            "none";


        recentMemoryList.innerHTML =
            recent
                .map(
                    (memory) => {

                        const url =
                            memory.url ||
                            memory.secure_url ||
                            memory.media_url ||
                            memory.image_url ||
                            memory.file_url ||
                            "";


                        const name =
                            memory.space_name ||
                            "Memory";


                        if (!url) {

                            return `
                                <div class="recent-memory-item">

                                    <div class="recent-memory-placeholder">
                                        <i class="fa-regular fa-image"></i>
                                    </div>

                                    <div class="recent-memory-overlay">
                                        ${escapeHTML(name)}
                                    </div>

                                </div>
                            `;

                        }


                        return `
                            <div
                                class="recent-memory-item"
                                title="${escapeHTML(name)}"
                            >

                                <img
                                    src="${escapeHTML(url)}"
                                    alt="Memory"
                                    loading="lazy"
                                >

                                <div class="recent-memory-overlay">
                                    ${escapeHTML(name)}
                                </div>

                            </div>
                        `;

                    }
                )
                .join("");


        return allMemories;

    }


    /* =========================================================
       RELATIVE DATE
    ========================================================= */

    function formatRelativeDate(dateValue) {

        if (!dateValue) {
            return "Recently";
        }


        const date =
            new Date(dateValue);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Recently";

        }


        const now =
            new Date();


        const difference =
            Math.floor(
                (now.getTime() -
                    date.getTime()) /
                1000
            );


        if (difference < 60) {
            return "Just now";
        }


        const minutes =
            Math.floor(
                difference / 60
            );


        if (minutes < 60) {

            return `${minutes} ${minutes === 1
                    ? "minute"
                    : "minutes"
                } ago`;

        }


        const hours =
            Math.floor(
                minutes / 60
            );


        if (hours < 24) {

            return `${hours} ${hours === 1
                    ? "hour"
                    : "hours"
                } ago`;

        }


        const days =
            Math.floor(
                hours / 24
            );


        if (days < 7) {

            return `${days} ${days === 1
                    ? "day"
                    : "days"
                } ago`;

        }


        return date.toLocaleDateString(
            undefined,
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =========================================================
       RECENT ACTIVITY
    ========================================================= */

    function renderRecentActivity(
        spaces,
        memories
    ) {

        if (
            !activityList ||
            !activityEmpty
        ) {
            return;
        }


        const activities = [];


        /*
         * SPACE ACTIVITIES
         */

        if (Array.isArray(spaces)) {

            spaces.forEach(
                (space) => {

                    const name =
                        space.space_name ||
                        space.name ||
                        "Untitled Space";


                    activities.push({

                        icon:
                            "fa-folder-open",

                        title:
                            `Space "${name}" is available`,

                        date:
                            space.created_at ||
                            space.updated_at

                    });

                }
            );

        }


        /*
         * MEMORY ACTIVITIES
         */

        if (Array.isArray(memories)) {

            memories
                .slice(0, 10)
                .forEach(
                    (memory) => {

                        activities.push({

                            icon:
                                "fa-image",

                            title:
                                `New memory in ${memory.space_name ||
                                "your space"
                                }`,

                            date:
                                memory.created_at ||
                                memory.uploaded_at ||
                                memory.updated_at

                        });

                    }
                );

        }


        /*
         * NEWEST FIRST
         */

        activities.sort(
            (a, b) => {

                const aTime =
                    new Date(
                        a.date || 0
                    ).getTime();


                const bTime =
                    new Date(
                        b.date || 0
                    ).getTime();


                return bTime - aTime;

            }
        );


        const visible =
            activities.slice(0, 5);


        if (!visible.length) {

            activityList.innerHTML =
                "";


            activityEmpty.style.display =
                "flex";


            return;

        }


        activityEmpty.style.display =
            "none";


        activityList.innerHTML =
            visible
                .map(
                    (activity) => {

                        return `
                            <div class="activity-item">

                                <div class="activity-item-icon">

                                    <i
                                        class="fa-solid ${escapeHTML(
                            activity.icon
                        )}"
                                    ></i>

                                </div>

                                <div class="activity-item-text">

                                    <strong>
                                        ${escapeHTML(
                            activity.title
                        )}
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                            formatRelativeDate(
                                activity.date
                            )
                        )}
                                    </span>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");

    }


    /* =========================================================
       STORAGE
    ========================================================= */

    function updateStorageUI() {

        /*
         * Storage calculation is not currently exposed
         * by the dashboard API.
         *
         * Keep the dashboard at the existing default:
         * 0 GB of 10 GB.
         */

        if (storageUsed) {

            storageUsed.textContent =
                "0 GB";

        }


        if (storageLimit) {

            storageLimit.textContent =
                "of 10 GB";

        }


        const ring =
            document.querySelector(
                ".ring span"
            );


        if (ring) {

            ring.textContent =
                "0%";

        }

    }


    /* =========================================================
       LOAD DASHBOARD DATA
    ========================================================= */

    async function loadDashboardData() {

        const spaces =
            await loadSpaces();


        if (!spaces.length) {

            if (totalMemories) {
                totalMemories.textContent =
                    "0";
            }


            if (totalPeople) {
                totalPeople.textContent =
                    "0";
            }


            if (recentMemoryList) {
                recentMemoryList.innerHTML =
                    "";
            }


            if (recentMemoriesEmpty) {
                recentMemoriesEmpty.style.display =
                    "flex";
            }


            if (activityList) {
                activityList.innerHTML =
                    "";
            }


            if (activityEmpty) {
                activityEmpty.style.display =
                    "flex";
            }


            updateStorageUI();

            return;

        }


        const [
            ,
            memories
        ] = await Promise.all([

            loadSpaceCounts(
                spaces
            ),

            loadRecentMemories(
                spaces
            )

        ]);


        renderRecentActivity(
            spaces,
            memories
        );


        updateStorageUI();

    }


    /* =========================================================
       CREATE SPACE MODAL
    ========================================================= */

    const modal =
        $("spaceModal");

    const createSpaceButton =
        $("createSpace");

    const closeModalButton =
        $("closeModal");

    const cancelModalButton =
        $("cancelModal");

    const spaceForm =
        $("spaceForm");

    const modalMessage =
        $("modalMessage");

    const spaceNameInput =
        $("spaceName");

    const spaceTypeInput =
        $("spaceType");

    const submitSpaceButton =
        $("submitSpace");


    function showCreateSpaceModal() {

        if (!modal) {
            return;
        }


        modal.classList.add(
            "open"
        );


        setTimeout(
            () => {

                spaceNameInput?.focus();

            },
            100
        );

    }


    function hideCreateSpaceModal() {

        if (!modal) {
            return;
        }


        modal.classList.remove(
            "open"
        );


        spaceForm?.reset();


        if (modalMessage) {

            modalMessage.textContent =
                "";

        }

    }


    createSpaceButton?.addEventListener(
        "click",
        showCreateSpaceModal
    );


    closeModalButton?.addEventListener(
        "click",
        hideCreateSpaceModal
    );


    cancelModalButton?.addEventListener(
        "click",
        hideCreateSpaceModal
    );


    modal?.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                modal
            ) {

                hideCreateSpaceModal();

            }

        }
    );


    /* =========================================================
       CREATE SPACE
    ========================================================= */

    spaceForm?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (modalMessage) {

                modalMessage.textContent =
                    "";

            }


            if (submitSpaceButton) {

                submitSpaceButton.disabled =
                    true;

                submitSpaceButton.textContent =
                    "Creating...";

            }


            try {

                const name =
                    spaceNameInput
                        ?.value
                        ?.trim() || "";


                const type =
                    spaceTypeInput
                        ?.value || "private";


                if (!name) {

                    throw new Error(
                        "Please enter a space name."
                    );

                }


                const response =
                    await api(
                        "/api/spaces/",
                        {
                            method: "POST",

                            body:
                                JSON.stringify({

                                    space_name:
                                        name,

                                    space_type:
                                        type

                                })

                        }
                    );


                if (!response) {
                    return;
                }


                const result =
                    await response
                        .json()
                        .catch(() => ({}));


                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        "Unable to create space."
                    );

                }


                hideCreateSpaceModal();


                /*
                 * Reload the entire dashboard so:
                 * - space count updates
                 * - new card appears
                 * - activity updates
                 * - statistics update
                 */

                await loadDashboardData();

            } catch (error) {

                console.error(
                    "Create space error:",
                    error
                );


                if (modalMessage) {

                    modalMessage.textContent =
                        error.message ||
                        "Unable to create space.";

                }

            } finally {

                if (submitSpaceButton) {

                    submitSpaceButton.disabled =
                        false;

                    submitSpaceButton.textContent =
                        "Create Space";

                }

            }

        }
    );


    /* =========================================================
       LOGOUT
    ========================================================= */

    const logoutButton =
        $("logout");


    logoutButton?.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "is_logged_in"
            );

            localStorage.removeItem(
                "user"
            );


            window.location.href =
                "/login";

        }
    );


    /* =========================================================
       SIDEBAR
    ========================================================= */

    const sidebar =
        $("sidebar");

    const sidebarOverlay =
        $("sidebarOverlay");

    const openSidebarButton =
        $("openSidebar");

    const closeSidebarButton =
        $("closeSidebar");


    function openSidebar() {

        sidebar?.classList.add(
            "open"
        );

        sidebarOverlay?.classList.add(
            "open"
        );

    }


    function closeSidebar() {

        sidebar?.classList.remove(
            "open"
        );

        sidebarOverlay?.classList.remove(
            "open"
        );

    }


    openSidebarButton?.addEventListener(
        "click",
        openSidebar
    );


    closeSidebarButton?.addEventListener(
        "click",
        closeSidebar
    );


    sidebarOverlay?.addEventListener(
        "click",
        closeSidebar
    );


    /* =========================================================
       SEARCH
    ========================================================= */

    const searchInput =
        $("search");


    searchInput?.addEventListener(
        "input",
        (event) => {

            const query =
                String(
                    event.target.value || ""
                )
                    .trim()
                    .toLowerCase();


            /*
             * Support both the old dashboard
             * .space cards and newer
             * .dashboard-space-card cards.
             */

            const cards =
                document.querySelectorAll(
                    ".space, .dashboard-space-card"
                );


            cards.forEach(
                (card) => {

                    const text =
                        card.textContent
                            .toLowerCase();


                    card.style.display =
                        !query ||
                            text.includes(query)
                            ? ""
                            : "none";

                }
            );

        }
    );


    /* =========================================================
       DASHBOARD SPACES -> ALL SPACES
    ========================================================= */

    viewAllSpaces?.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            window.location.href =
                "/spaces";

        }
    );


    /* =========================================================
       SIDEBAR NAVIGATION
    ========================================================= */

    async function openFirstSpaceTab(
        tabName
    ) {

        const spaceId =
            await getFirstSpaceId();


        if (!spaceId) {

            console.warn(
                "No space available."
            );

            return;

        }


        window.location.href =
            `/spaces/${encodeURIComponent(
                String(spaceId)
            )}#${encodeURIComponent(
                tabName
            )}`;

    }


    /*
     * Memories
     */

    const dashboardMemoriesLink =
        $("dashboardMemoriesLink");


    dashboardMemoriesLink?.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();

            await openFirstSpaceTab(
                "memories"
            );

        }
    );


    /*
     * People
     */

    const dashboardPeopleLink =
        $("dashboardPeopleLink");


    dashboardPeopleLink?.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();

            await openFirstSpaceTab(
                "members"
            );

        }
    );


    /*
     * Timeline
     */

    const dashboardTimelineLink =
        $("dashboardTimelineLink");


    dashboardTimelineLink?.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();

            await openFirstSpaceTab(
                "timeline"
            );

        }
    );


    /* =========================================================
       DASHBOARD STAT CARD NAVIGATION
    ========================================================= */

    const totalSpacesCard =
        totalSpaces?.closest(
            ".stat"
        );


    const totalMemoriesCard =
        totalMemories?.closest(
            ".stat"
        );


    const totalPeopleCard =
        totalPeople?.closest(
            ".stat"
        );


    /*
     * TOTAL SPACES
     */

    totalSpacesCard?.addEventListener(
        "click",
        () => {

            const spacesSection =
                $("spaces");


            if (spacesSection) {

                spacesSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }
    );


    /*
     * TOTAL MEMORIES
     */

    totalMemoriesCard?.addEventListener(
        "click",
        async () => {

            await openFirstSpaceTab(
                "memories"
            );

        }
    );


    /*
     * PEOPLE CONNECTED
     */

    totalPeopleCard?.addEventListener(
        "click",
        async () => {

            await openFirstSpaceTab(
                "members"
            );

        }
    );


    [
        totalSpacesCard,
        totalMemoriesCard,
        totalPeopleCard
    ].forEach(
        (card) => {

            if (!card) {
                return;
            }


            card.style.cursor =
                "pointer";

        }
    );


    /* =========================================================
       RECENT MEMORIES -> VIEW ALL
    ========================================================= */

    const viewAllMemories =
        $("viewAllMemories");


    viewAllMemories?.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();


            await openFirstSpaceTab(
                "memories"
            );

        }
    );


    /* =========================================================
       RECENT ACTIVITY -> TIMELINE
    ========================================================= */

    async function openFirstSpaceTimeline() {

        const currentToken =
            localStorage.getItem(
                "access_token"
            );


        if (!currentToken) {

            window.location.href =
                "/login";

            return;

        }


        try {

            const response =
                await fetch(
                    "/api/spaces/",
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${currentToken}`
                        }

                    }
                );


            if (response.status === 401) {

                localStorage.removeItem(
                    "access_token"
                );

                localStorage.removeItem(
                    "is_logged_in"
                );

                localStorage.removeItem(
                    "user"
                );


                window.location.href =
                    "/login";

                return;

            }


            if (!response.ok) {

                console.error(
                    "Unable to load spaces."
                );

                return;

            }


            const result =
                await response
                    .json()
                    .catch(() => ({}));


            const spaces =
                result.data?.spaces || [];


            if (
                !Array.isArray(spaces) ||
                !spaces.length
            ) {

                console.warn(
                    "No spaces available."
                );

                return;

            }


            const space =
                spaces[0];


            const spaceId =
                space._id ||
                space.id ||
                space.space_id;


            if (!spaceId) {

                console.error(
                    "Space ID not found."
                );

                return;

            }


            /*
             * IMPORTANT:
             * Use assign() so the browser definitely
             * performs the navigation.
             */

            window.location.assign(
                `/spaces/${encodeURIComponent(
                    String(spaceId)
                )}#timeline`
            );

        } catch (error) {

            console.error(
                "Unable to open Timeline:",
                error
            );

        }

    }


    /*
     * Direct handler.
     *
     * Works when Dashboard HTML contains:
     *
     * id="viewAllActivity"
     */

    const viewAllActivity =
        $("viewAllActivity");


    viewAllActivity?.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            openFirstSpaceTimeline();

        }
    );


    /*
     * Delegated fallback.
     *
     * This is intentionally kept because the current
     * Dashboard HTML may not have an ID on the
     * Recent Activity "View all" button.
     */

    document.addEventListener(
        "click",
        (event) => {

            const target =
                event.target instanceof Element
                    ? event.target.closest(
                        "button, a"
                    )
                    : null;


            if (!target) {
                return;
            }


            /*
             * Dedicated ID is already handled above.
             */

            if (
                target.id ===
                "viewAllActivity"
            ) {

                return;

            }


            const label =
                target.textContent
                    .trim()
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .toLowerCase();


            if (
                label !==
                "view all"
            ) {

                return;

            }


            const activityElement =
                $("activityList");


            if (!activityElement) {
                return;
            }


            /*
             * Find the container that owns
             * the Recent Activity list.
             */

            const activityPanel =
                activityElement.closest(
                    ".panel, .card, .dashboard-card, section"
                );


            if (!activityPanel) {

                return;

            }


            /*
             * Make sure this "View all"
             * belongs to Recent Activity.
             */

            if (
                !activityPanel.contains(
                    target
                )
            ) {

                return;

            }


            event.preventDefault();

            event.stopPropagation();


            openFirstSpaceTimeline();

        },
        true
    );


    /* =========================================================
       VIEW ALL SPACES FALLBACK
    ========================================================= */

    /*
     * If the HTML contains a "View all" control for
     * Your Spaces without the expected ID, detect it
     * using the spaces container.
     */

    document.addEventListener(
        "click",
        (event) => {

            const target =
                event.target instanceof Element
                    ? event.target.closest(
                        "button, a"
                    )
                    : null;


            if (!target) {
                return;
            }


            if (
                target.id ===
                "viewAllSpaces"
            ) {

                return;

            }


            const label =
                target.textContent
                    .trim()
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .toLowerCase();


            if (
                label !==
                "view all"
            ) {

                return;

            }


            const spacesElement =
                $("spaces");


            if (!spacesElement) {
                return;
            }


            const spacesPanel =
                spacesElement.closest(
                    ".panel, .card, .dashboard-card, section"
                );


            if (!spacesPanel) {
                return;
            }


            if (
                !spacesPanel.contains(
                    target
                )
            ) {

                return;

            }


            event.preventDefault();

            window.location.href =
                "/spaces";

        },
        true
    );


    /* =========================================================
       RECENT MEMORIES FALLBACK
    ========================================================= */

    document.addEventListener(
        "click",
        (event) => {

            const target =
                event.target instanceof Element
                    ? event.target.closest(
                        "button, a"
                    )
                    : null;


            if (!target) {
                return;
            }


            if (
                target.id ===
                "viewAllMemories"
            ) {

                return;

            }


            const label =
                target.textContent
                    .trim()
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .toLowerCase();


            if (
                label !==
                "view all"
            ) {

                return;

            }


            const memoryElement =
                $("recentMemoryList");


            if (!memoryElement) {
                return;
            }


            const memoryPanel =
                memoryElement.closest(
                    ".panel, .card, .dashboard-card, section"
                );


            if (!memoryPanel) {
                return;
            }


            if (
                !memoryPanel.contains(
                    target
                )
            ) {

                return;

            }


            event.preventDefault();

            event.stopPropagation();


            openFirstSpaceTab(
                "memories"
            );

        },
        true
    );


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    loadDashboardData();

});