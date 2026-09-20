document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("access_token");

    if (!token) {
        location.href = "/login";
        return;
    }

    let user = {};

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
    } catch { }

    const name = user.name || "there";

    document.getElementById("welcomeName").textContent = name;
    document.getElementById("sideName").textContent = name;
    document.getElementById("sideEmail").textContent =
        user.email || "Account";

    document.getElementById("avatar").textContent =
        name.charAt(0).toUpperCase();


    const spaces =
        document.getElementById("spaces");

    const total =
        document.getElementById("totalSpaces");


    async function api(url, opt = {}) {

        const r = await fetch(url, {
            ...opt,
            headers: {
                ...(opt.headers || {}),
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (r.status === 401) {

            localStorage.clear();

            location.href = "/login";

            return null;
        }

        return r;
    }


    function esc(v) {

        return String(v ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    function type(v) {

        return v
            ? v[0].toUpperCase() + v.slice(1)
            : "Private";

    }


    function card(s) {

        const el =
            document.createElement("article");

        el.className = "space";

        const spaceId =
            s._id ||
            s.id ||
            s.space_id;

        el.dataset.spaceId =
            spaceId || "";


        el.innerHTML = `
            <div class="cover">
                ${s.cover_image
                ? `<img src="${esc(s.cover_image)}" alt="">`
                : ""
            }

                <span class="type">
                    ${esc(type(s.space_type))}
                </span>
            </div>

            <div class="space-body">

                <h3>
                    ${esc(
                s.space_name ||
                "Untitled Space"
            )}
                </h3>

                <div class="meta">

                    <span>
                        <i class="fa-regular fa-images"></i>
                        0 memories
                    </span>

                    <span>
                        <i class="fa-solid fa-lock"></i>
                    </span>

                </div>

            </div>
        `;


        if (spaceId) {

            el.addEventListener(
                "click",
                () => {

                    location.href =
                        `/spaces/${encodeURIComponent(spaceId)}`;

                }
            );

        }


        return el;
    }


    async function load() {

        spaces.innerHTML =
            `
            <div class="loading">
                <i class="fa-solid fa-spinner"></i>
                Loading your spaces...
            </div>
            `;


        try {

            const r =
                await api("/api/spaces");

            if (!r) {
                return;
            }


            const data =
                await r.json();


            if (
                !r.ok ||
                !data.success
            ) {

                throw Error(
                    data.message ||
                    "Unable to load spaces"
                );

            }


            const list =
                Array.isArray(
                    data.data?.spaces
                )
                    ? data.data.spaces
                    : [];


            total.textContent =
                list.length;


            if (!list.length) {

                spaces.innerHTML =
                    `
                    <div class="loading">
                        <i class="fa-solid fa-layer-group"></i>
                        <span>
                            No spaces yet.
                            Create your first space above.
                        </span>
                    </div>
                    `;

                return;
            }


            spaces.innerHTML = "";

            list
                .forEach(s => {

                    spaces.appendChild(
                        card(s)
                    );

                });

        }

        catch (e) {

            console.error(e);

            spaces.innerHTML =
                `
                <div class="loading">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span>
                        Could not load spaces.
                        Refresh and try again.
                    </span>
                </div>
                `;

        }

    }


    load();


    const modal =
        document.getElementById("spaceModal");

    const open =
        document.getElementById("createSpace");

    const close =
        document.getElementById("closeModal");

    const cancel =
        document.getElementById("cancelModal");

    const form =
        document.getElementById("spaceForm");

    const msg =
        document.getElementById("modalMessage");

    const nameInput =
        document.getElementById("spaceName");

    const typeInput =
        document.getElementById("spaceType");

    const submit =
        document.getElementById("submitSpace");


    function show() {

        modal.classList.add("open");

        setTimeout(
            () => nameInput.focus(),
            100
        );

    }


    function hide() {

        modal.classList.remove("open");

        form.reset();

        msg.textContent = "";

    }


    open.onclick = show;

    close.onclick = hide;

    cancel.onclick = hide;


    modal.onclick = e => {

        if (e.target === modal) {
            hide();
        }

    };


    form.onsubmit = async e => {

        e.preventDefault();

        msg.textContent = "";

        submit.disabled = true;

        submit.textContent =
            "Creating...";


        try {

            const r =
                await api(
                    "/api/spaces",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            space_name:
                                nameInput.value.trim(),

                            space_type:
                                typeInput.value
                        })
                    }
                );


            if (!r) {
                return;
            }


            const d =
                await r.json();


            if (
                !r.ok ||
                !d.success
            ) {

                throw Error(
                    d.message ||
                    "Unable to create space"
                );

            }


            hide();

            await load();

        }

        catch (e) {

            msg.textContent =
                e.message;

        }

        finally {

            submit.disabled = false;

            submit.textContent =
                "Create Space";

        }

    };


    document
        .getElementById("logout")
        .onclick = () => {

            localStorage.clear();

            location.href = "/login";

        };


    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("sidebarOverlay");


    document
        .getElementById("openSidebar")
        .onclick = () => {

            sidebar.classList.add("open");

            overlay.classList.add("open");

        };


    document
        .getElementById("closeSidebar")
        .onclick = () => {

            sidebar.classList.remove("open");

            overlay.classList.remove("open");

        };


    overlay.onclick = () => {

        sidebar.classList.remove("open");

        overlay.classList.remove("open");

    };


    document
        .getElementById("search")
        .addEventListener(
            "input",
            e => {

                const q =
                    e.target.value.toLowerCase();


                document
                    .querySelectorAll(".space")
                    .forEach(x => {

                        x.style.display =
                            !q ||
                                x.textContent
                                    .toLowerCase()
                                    .includes(q)
                                ? ""
                                : "none";

                    });

            }
        );

});


/* =========================================================
   DASHBOARD POLISH
========================================================= */

(() => {

    const welcomeName =
        document.getElementById("welcomeName");

    const totalSpaces =
        document.getElementById("totalSpaces");

    const totalMemories =
        document.getElementById("totalMemories");

    const totalPeople =
        document.getElementById("totalPeople");

    const spacesContainer =
        document.getElementById("spaces");

    const recentMemoryList =
        document.getElementById("recentMemoryList");

    const recentMemoriesEmpty =
        document.getElementById("recentMemoriesEmpty");

    const activityList =
        document.getElementById("activityList");

    const activityEmpty =
        document.getElementById("activityEmpty");

    const viewAllSpaces =
        document.getElementById("viewAllSpaces");


    /* ---------------------------------------------------------
       USER
    --------------------------------------------------------- */

    function loadDashboardUser() {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return;
            }

            const user =
                JSON.parse(storedUser);

            const name =
                user.name ||
                user.full_name ||
                user.username ||
                user.email?.split("@")[0] ||
                "there";

            if (welcomeName) {
                welcomeName.textContent = name;
            }

        } catch (error) {

            console.error(
                "Dashboard user loading error:",
                error
            );

        }
    }


    /* ---------------------------------------------------------
       DATE
    --------------------------------------------------------- */

    function formatRelativeDate(value) {

        if (!value) {
            return "";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        const diff =
            Date.now() -
            date.getTime();

        const minutes =
            Math.floor(
                diff / 60000
            );

        if (minutes < 1) {
            return "Just now";
        }

        if (minutes < 60) {
            return `${minutes}m ago`;
        }

        const hours =
            Math.floor(
                minutes / 60
            );

        if (hours < 24) {
            return `${hours}h ago`;
        }

        const days =
            Math.floor(
                hours / 24
            );

        if (days < 7) {
            return `${days}d ago`;
        }

        return date.toLocaleDateString(
            [],
            {
                day: "numeric",
                month: "short"
            }
        );
    }


    /* ---------------------------------------------------------
       ESCAPE HTML
    --------------------------------------------------------- */

    function escapeDashboardHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;
    }


    /* ---------------------------------------------------------
       FETCH SPACES
    --------------------------------------------------------- */

    async function loadDashboardData() {

        if (!spacesContainer) {
            return;
        }

        try {

            const response =
                await api("/api/spaces/");

            if (!response) {
                return;
            }

            const result =
                await response.json()
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
                result.data?.spaces ||
                [];

            updateDashboardStats(
                spaces
            );

            renderDashboardSpaces(
                spaces
            );

            await loadDashboardContent(
                spaces
            );

        } catch (error) {

            console.error(
                "Dashboard loading error:",
                error
            );

        }

    }


    /* ---------------------------------------------------------
       STATS
    --------------------------------------------------------- */

    async function updateDashboardStats(spaces) {

        if (totalSpaces) {
            totalSpaces.textContent =
                spaces.length;
        }

        let memoriesCount = 0;
        let peopleCount = 0;

        /*
         * Fetch members and memories for each
         * accessible space.
         */

        const results =
            await Promise.allSettled(

                spaces.map(
                    async (space) => {

                        const id =
                            space._id ||
                            space.id ||
                            space.space_id;

                        if (!id) {
                            return {
                                memories: 0,
                                people: 0
                            };
                        }

                        let memories = 0;
                        let people = 0;

                        try {

                            const response =
                                await api(
                                    `/api/spaces/${id}/memories`
                                );

                            if (response?.ok) {

                                const result =
                                    await response
                                        .json()
                                        .catch(
                                            () => ({})
                                        );

                                memories =
                                    result.data
                                        ?.memories
                                        ?.length || 0;
                            }

                        } catch (error) {

                            console.error(
                                "Memory count error:",
                                error
                            );

                        }


                        try {

                            const response =
                                await api(
                                    `/api/spaces/${id}/members`
                                );

                            if (response?.ok) {

                                const result =
                                    await response
                                        .json()
                                        .catch(
                                            () => ({})
                                        );

                                people =
                                    result.data
                                        ?.members
                                        ?.length || 0;
                            }

                        } catch (error) {

                            console.error(
                                "Member count error:",
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
                    result.value.memories;

                peopleCount +=
                    result.value.people;

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


    /* ---------------------------------------------------------
       SPACE CARDS
    --------------------------------------------------------- */

    function renderDashboardSpaces(spaces) {

        if (!spacesContainer) {
            return;
        }

        if (!spaces.length) {

            spacesContainer.innerHTML = `
                <div class="dashboard-space-empty">

                    <div class="dashboard-empty-icon">
                        <i class="fa-regular fa-folder-open"></i>
                    </div>

                    <div>
                        <strong>No spaces yet</strong>

                        <span>
                            Create your first private
                            space to get started.
                        </span>
                    </div>

                    <button
                        type="button"
                        class="create-btn"
                        id="emptyCreateSpace"
                    >
                        <i class="fa-solid fa-plus"></i>
                        Create Space
                    </button>

                </div>
            `;

            document
                .getElementById("emptyCreateSpace")
                ?.addEventListener(
                    "click",
                    () => {

                        document
                            .getElementById(
                                "createSpace"
                            )
                            ?.click();

                    }
                );

            return;
        }


        /*
         * We intentionally don't replace an existing
         * project-specific space renderer if one is
         * already present.
         */

        if (
            spacesContainer
                .querySelector(
                    ".space-card"
                )
        ) {
            return;
        }

        /*
         * IMPORTANT:
         * Show ALL spaces instead of limiting
         * the dashboard to six spaces.
         */

        spacesContainer.innerHTML =
            spaces
                .map((space) => {

                    const id =
                        space._id ||
                        space.id ||
                        space.space_id;

                    const name =
                        space.space_name ||
                        space.name ||
                        "Untitled Space";

                    const type =
                        space.space_type ||
                        space.type ||
                        "private";

                    return `
                        <a
                            class="dashboard-space-card"
                            href="/spaces/${encodeURIComponent(id)}"
                        >

                            <div class="dashboard-space-icon">
                                <i class="fa-solid fa-heart"></i>
                            </div>

                            <div class="dashboard-space-info">

                                <strong>
                                    ${escapeDashboardHTML(name)}
                                </strong>

                                <span>
                                    ${escapeDashboardHTML(
                        String(type)
                            .replace(
                                /^./,
                                letter =>
                                    letter
                                        .toUpperCase()
                            )
                    )}
                                    space
                                </span>

                            </div>

                            <i class="fa-solid fa-chevron-right dashboard-space-arrow"></i>

                        </a>
                    `;

                })
                .join("");

    }


    /* ---------------------------------------------------------
       RECENT CONTENT
    --------------------------------------------------------- */

    async function loadDashboardContent(spaces) {

        const allMemories = [];

        for (
            const space of spaces
        ) {

            const id =
                space._id ||
                space.id ||
                space.space_id;

            if (!id) {
                continue;
            }

            try {

                const response =
                    await api(
                        `/api/spaces/${id}/memories`
                    );

                if (!response?.ok) {
                    continue;
                }

                const result =
                    await response
                        .json()
                        .catch(() => ({}));

                const memories =
                    result.data?.memories ||
                    [];

                memories.forEach(
                    (memory) => {

                        allMemories.push({
                            ...memory,
                            space_name:
                                space.space_name ||
                                space.name ||
                                "Space"
                        });

                    }
                );

            } catch (error) {

                console.error(
                    "Recent memory error:",
                    error
                );

            }

        }


        allMemories.sort(
            (a, b) => {

                const dateA =
                    new Date(
                        a.created_at ||
                        a.uploaded_at ||
                        0
                    ).getTime();

                const dateB =
                    new Date(
                        b.created_at ||
                        b.uploaded_at ||
                        0
                    ).getTime();

                return dateB - dateA;

            }
        );


        renderRecentMemories(
            allMemories.slice(0, 6)
        );


        renderRecentActivity(
            spaces,
            allMemories
        );

    }


    /* ---------------------------------------------------------
       RECENT MEMORIES
    --------------------------------------------------------- */

    function renderRecentMemories(memories) {

        if (
            !recentMemoryList ||
            !recentMemoriesEmpty
        ) {
            return;
        }

        if (!memories.length) {

            recentMemoryList.innerHTML =
                "";

            recentMemoriesEmpty.style.display =
                "flex";

            return;
        }


        recentMemoriesEmpty.style.display =
            "none";


        recentMemoryList.innerHTML =
            memories
                .map((memory) => {

                    const url =
                        memory.media_url ||
                        memory.url ||
                        memory.image_url;

                    if (!url) {
                        return "";
                    }

                    return `
                        <div
                            class="recent-memory-item"
                            title="${escapeDashboardHTML(
                        memory.space_name
                    )}"
                        >

                            <img
                                src="${escapeDashboardHTML(url)}"
                                alt="Memory"
                                loading="lazy"
                            >

                            <div
                                class="recent-memory-overlay"
                            >
                                ${escapeDashboardHTML(
                        memory.space_name
                    )}
                            </div>

                        </div>
                    `;

                })
                .join("");

    }


    /* ---------------------------------------------------------
       RECENT ACTIVITY
    --------------------------------------------------------- */

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


        spaces.forEach(
            (space) => {

                const name =
                    space.space_name ||
                    space.name ||
                    "Untitled Space";

                const created =
                    space.created_at;

                activities.push({
                    icon:
                        "fa-folder-open",
                    title:
                        `Space "${name}" is available`,
                    date:
                        created
                });

            }
        );


        memories
            .slice(0, 5)
            .forEach(
                (memory) => {

                    activities.push({

                        icon:
                            "fa-image",

                        title:
                            `New memory in ${memory.space_name}`,

                        date:
                            memory.created_at ||
                            memory.uploaded_at

                    });

                }
            );


        activities.sort(
            (a, b) => {

                const aDate =
                    new Date(
                        a.date || 0
                    ).getTime();

                const bDate =
                    new Date(
                        b.date || 0
                    ).getTime();

                return bDate - aDate;

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
                                    <i class="fa-regular ${activity.icon}"></i>
                                </div>

                                <div class="activity-item-text">

                                    <strong>
                                        ${escapeDashboardHTML(
                            activity.title
                        )}
                                    </strong>

                                    <span>
                                        ${formatRelativeDate(
                            activity.date
                        )}
                                    </span>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");

    }


    /* ---------------------------------------------------------
       VIEW ALL
    --------------------------------------------------------- */

    viewAllSpaces?.addEventListener(
        "click",
        () => {
            window.location.href = "/spaces";
        }
    );

    /* ---------------------------------------------------------
       SEARCH
    --------------------------------------------------------- */

    const searchInput =
        document.getElementById("search");


    searchInput?.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const cards =
                document.querySelectorAll(
                    ".dashboard-space-card"
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


    /* ---------------------------------------------------------
       INITIALIZE
    --------------------------------------------------------- */

    loadDashboardUser();

    loadDashboardData();

})();