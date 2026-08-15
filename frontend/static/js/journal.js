document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const sidebar =
        document.getElementById("journalSidebar");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const journalModal =
        document.getElementById("journalModal");

    const openJournalModal =
        document.getElementById("openJournalModal");

    const emptyCreate =
        document.getElementById("emptyCreate");

    const usePrompt =
        document.getElementById("usePrompt");

    const closeJournalModal =
        document.getElementById("closeJournalModal");

    const cancelJournal =
        document.getElementById("cancelJournal");

    const journalForm =
        document.getElementById("journalForm");

    const entryTitle =
        document.getElementById("entryTitle");

    const entryContent =
        document.getElementById("entryContent");

    const entryTags =
        document.getElementById("entryTags");

    const wordCounter =
        document.getElementById("wordCounter");

    const moodOptions =
        document.querySelectorAll(".mood-option");

    const journalSearch =
        document.getElementById("journalSearch");

    const journalFilters =
        document.querySelectorAll(".journal-filter");

    const journalEmpty =
        document.getElementById("journalEmpty");

    const entriesGrid =
        document.getElementById("entriesGrid");

    const readerModal =
        document.getElementById("readerModal");

    const closeReader =
        document.getElementById("closeReader");

    const readerTitle =
        document.getElementById("readerTitle");

    const readerContent =
        document.getElementById("readerContent");

    const readerDate =
        document.getElementById("readerDate");

    const readerMood =
        document.getElementById("readerMood");

    const readerFavorite =
        document.getElementById("readerFavorite");


    let selectedMood = "thoughtful";

    let entries = [];


    // =====================================================
    // MOBILE SIDEBAR
    // =====================================================

    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle("open");

            }
        );

    }


    // =====================================================
    // MODAL
    // =====================================================

    function openModal() {

        journalModal.classList.add("open");

        document.body.style.overflow =
            "hidden";

        setTimeout(
            () => entryTitle.focus(),
            100
        );

    }


    function closeModal() {

        journalModal.classList.remove("open");

        document.body.style.overflow =
            "";

    }


    openJournalModal.addEventListener(
        "click",
        openModal
    );


    emptyCreate.addEventListener(
        "click",
        openModal
    );


    usePrompt.addEventListener(
        "click",
        () => {

            openModal();

            entryTitle.value =
                "A moment I never want to forget";

            entryContent.focus();

        }
    );


    closeJournalModal.addEventListener(
        "click",
        closeModal
    );


    cancelJournal.addEventListener(
        "click",
        closeModal
    );


    journalModal.addEventListener(
        "click",
        event => {

            if (
                event.target === journalModal
            ) {

                closeModal();

            }

        }
    );


    // =====================================================
    // MOOD
    // =====================================================

    moodOptions.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    moodOptions.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    option.classList.add(
                        "active"
                    );


                    selectedMood =
                        option.dataset.mood;

                }
            );

        }
    );


    // Select thoughtful by default

    const defaultMood =
        document.querySelector(
            '[data-mood="thoughtful"]'
        );


    if (defaultMood) {

        defaultMood.classList.add(
            "active"
        );

    }


    // =====================================================
    // WORD COUNTER
    // =====================================================

    entryContent.addEventListener(
        "input",
        updateCounter
    );


    function updateCounter() {

        const text =
            entryContent.value.trim();


        const words =
            text.length
                ? text.split(/\s+/).length
                : 0;


        const characters =
            entryContent.value.length;


        wordCounter.textContent =
            `${words} words · ${characters} characters`;

    }


    // =====================================================
    // SAVE ENTRY
    // =====================================================

    journalForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const title =
                entryTitle.value.trim();

            const content =
                entryContent.value.trim();

            const tags =
                entryTags.value
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(Boolean);


            if (
                !title ||
                !content
            ) {

                return;

            }


            const newEntry = {

                id:
                    Date.now(),

                title,

                content,

                mood:
                    getMoodEmoji(
                        selectedMood
                    ),

                moodName:
                    selectedMood,

                tags,

                date:
                    new Date(),

                favorite:
                    false

            };


            entries.unshift(
                newEntry
            );


            renderEntries();


            const saveButton =
                document.getElementById(
                    "saveEntry"
                );


            saveButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Saving...
            `;


            saveButton.disabled = true;


            /*
             * UI-only for now.
             *
             * Later this exact point will
             * call the Journal API.
             */

            setTimeout(
                () => {

                    saveButton.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Saved
                    `;


                    setTimeout(
                        () => {

                            journalForm.reset();

                            selectedMood =
                                "thoughtful";


                            moodOptions.forEach(
                                item => {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                            if (defaultMood) {

                                defaultMood.classList.add(
                                    "active"
                                );

                            }


                            updateCounter();


                            saveButton.innerHTML = `
                                <i class="fa-solid fa-lock"></i>
                                Save Entry
                            `;


                            saveButton.disabled =
                                false;


                            closeModal();

                        },
                        600
                    );

                },
                800
            );

        }
    );


    // =====================================================
    // RENDER ENTRIES
    // =====================================================

    function renderEntries(
        filteredEntries = entries
    ) {

        entriesGrid.innerHTML = "";


        if (
            filteredEntries.length === 0
        ) {

            entriesGrid.classList.add(
                "hidden"
            );

            journalEmpty.style.display =
                "flex";

            return;

        }


        journalEmpty.style.display =
            "none";


        entriesGrid.classList.remove(
            "hidden"
        );


        filteredEntries.forEach(
            entry => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "journal-entry-card";


                card.dataset.id =
                    entry.id;


                const formattedDate =
                    entry.date.toLocaleDateString(
                        "en-US",
                        {
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                        }
                    );


                const excerpt =
                    entry.content.length > 150
                        ? entry.content.slice(
                            0,
                            150
                        ) + "..."
                        : entry.content;


                const tagsHTML =
                    entry.tags
                        .slice(0, 3)
                        .map(
                            tag =>
                                `<span class="entry-tag">${escapeHTML(tag)}</span>`
                        )
                        .join("");


                card.innerHTML = `

                    <div class="entry-card-top">

                        <div>

                            <span class="entry-card-date">
                                ${formattedDate.toUpperCase()}
                            </span>

                            <h3>
                                ${escapeHTML(entry.title)}
                            </h3>

                        </div>

                        <span class="entry-card-mood">
                            ${entry.mood}
                        </span>

                    </div>


                    <p class="entry-excerpt">
                        ${escapeHTML(excerpt)}
                    </p>


                    <div class="entry-card-bottom">

                        <div class="entry-tags">

                            ${tagsHTML}

                        </div>


                        <span class="entry-private">

                            <i class="fa-solid fa-lock"></i>

                            Private

                        </span>

                    </div>

                `;


                card.addEventListener(
                    "click",
                    () => {

                        openReader(
                            entry
                        );

                    }
                );


                entriesGrid.appendChild(
                    card
                );

            }
        );

    }


    // =====================================================
    // READER
    // =====================================================

    function openReader(entry) {

        readerTitle.textContent =
            entry.title;


        readerContent.textContent =
            entry.content;


        readerMood.textContent =
            entry.mood;


        readerDate.textContent =
            entry.date
                .toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    }
                )
                .toUpperCase();


        readerModal.classList.add(
            "open"
        );


        document.body.style.overflow =
            "hidden";

    }


    closeReader.addEventListener(
        "click",
        () => {

            readerModal.classList.remove(
                "open"
            );

            document.body.style.overflow =
                "";

        }
    );


    readerModal.addEventListener(
        "click",
        event => {

            if (
                event.target === readerModal
            ) {

                readerModal.classList.remove(
                    "open"
                );

                document.body.style.overflow =
                    "";

            }

        }
    );


    // =====================================================
    // SEARCH
    // =====================================================

    journalSearch.addEventListener(
        "input",
        () => {

            const query =
                journalSearch.value
                    .trim()
                    .toLowerCase();


            const filtered =
                entries.filter(
                    entry => {

                        return (
                            entry.title
                                .toLowerCase()
                                .includes(query) ||

                            entry.content
                                .toLowerCase()
                                .includes(query) ||

                            entry.tags.some(
                                tag =>
                                    tag
                                        .toLowerCase()
                                        .includes(query)
                            )
                        );

                    }
                );


            renderEntries(
                filtered
            );

        }
    );


    // =====================================================
    // FILTERS
    // =====================================================

    journalFilters.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    journalFilters.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const filter =
                        button.dataset.filter;


                    let filtered =
                        [...entries];


                    if (
                        filter === "favorites"
                    ) {

                        filtered =
                            entries.filter(
                                entry =>
                                    entry.favorite
                            );

                    }


                    /*
                     * All entries are private
                     * in the current UI.
                     */

                    if (
                        filter === "private"
                    ) {

                        filtered =
                            [...entries];

                    }


                    renderEntries(
                        filtered
                    );

                }
            );

        }
    );


    // =====================================================
    // HELPERS
    // =====================================================

    function getMoodEmoji(
        mood
    ) {

        const moods = {

            happy: "😊",

            loved: "🥰",

            calm: "😌",

            sad: "😔",

            excited: "🤩",

            thoughtful: "🥹"

        };


        return (
            moods[mood] ||
            "🥹"
        );

    }


    function escapeHTML(
        value
    ) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            value;


        return div.innerHTML;

    }


    // =====================================================
    // ESCAPE KEY
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
                journalModal.classList.contains(
                    "open"
                )
            ) {

                closeModal();

            }


            if (
                readerModal.classList.contains(
                    "open"
                )
            ) {

                readerModal.classList.remove(
                    "open"
                );

                document.body.style.overflow =
                    "";

            }

        }
    );


    // =====================================================
    // INITIAL STATE
    // =====================================================

    renderEntries();

});