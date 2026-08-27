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
                .slice(0, 4)
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