document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const sidebar =
        document.getElementById("timelineSidebar");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const eventModal =
        document.getElementById("eventModal");

    const openEventModal =
        document.getElementById("openEventModal");

    const closeEventModal =
        document.getElementById("closeEventModal");

    const cancelEvent =
        document.getElementById("cancelEvent");

    const eventForm =
        document.getElementById("eventForm");

    const timelineSearch =
        document.getElementById("timelineSearch");

    const timelineEmpty =
        document.getElementById("timelineEmpty");

    const yearButtons =
        document.querySelectorAll(".year-button");

    const timelineYears =
        document.querySelectorAll(".timeline-year");


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

        eventModal.classList.add("open");

        document.body.style.overflow =
            "hidden";

    }


    function closeModal() {

        eventModal.classList.remove("open");

        document.body.style.overflow =
            "";

    }


    openEventModal.addEventListener(
        "click",
        openModal
    );


    closeEventModal.addEventListener(
        "click",
        closeModal
    );


    cancelEvent.addEventListener(
        "click",
        closeModal
    );


    eventModal.addEventListener(
        "click",
        event => {

            if (
                event.target === eventModal
            ) {

                closeModal();

            }

        }
    );


    // =====================================================
    // YEAR FILTER
    // =====================================================

    yearButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                yearButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                const selectedYear =
                    button.dataset.year;


                let visible =
                    selectedYear === "all";


                timelineYears.forEach(
                    yearSection => {

                        if (
                            selectedYear === "all"
                        ) {

                            yearSection.style.display =
                                "block";

                            visible = true;

                        } else {

                            const matches =
                                yearSection.dataset.year ===
                                selectedYear;

                            yearSection.style.display =
                                matches
                                    ? "block"
                                    : "none";

                            if (matches) {
                                visible = true;
                            }

                        }

                    }
                );


                timelineEmpty.style.display =
                    visible
                        ? "none"
                        : "block";

            }
        );

    });


    // =====================================================
    // SEARCH
    // =====================================================

    timelineSearch.addEventListener(
        "input",
        () => {

            const query =
                timelineSearch.value
                    .trim()
                    .toLowerCase();


            let results = 0;


            document
                .querySelectorAll(
                    ".timeline-event"
                )
                .forEach(event => {

                    const title =
                        event.dataset.title
                            .toLowerCase();

                    const content =
                        event.textContent
                            .toLowerCase();


                    const matches =
                        title.includes(query) ||
                        content.includes(query);


                    event.style.display =
                        matches
                            ? "block"
                            : "none";


                    if (matches) {
                        results++;
                    }

                });


            timelineEmpty.style.display =
                results === 0
                    ? "block"
                    : "none";


            /*
             * Hide years with no visible events.
             */

            timelineYears.forEach(
                year => {

                    const visibleEvents =
                        year.querySelectorAll(
                            ".timeline-event:not([style*='display: none'])"
                        );


                    year.style.display =
                        visibleEvents.length
                            ? "block"
                            : "none";

                }
            );

        }
    );


    // =====================================================
    // EVENT FORM
    // =====================================================

    eventForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const title =
                document
                    .getElementById("eventTitle")
                    .value
                    .trim();

            const date =
                document
                    .getElementById("eventDate")
                    .value;

            const description =
                document
                    .getElementById("eventDescription")
                    .value
                    .trim();

            const location =
                document
                    .getElementById("eventLocation")
                    .value
                    .trim();


            if (!title || !date) {
                return;
            }


            const formattedDate =
                new Date(
                    `${date}T00:00:00`
                ).toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    }
                );


            console.log(
                "Timeline event:",
                {
                    title,
                    date,
                    description,
                    location
                }
            );


            /*
             * UI-only for now.
             * Backend integration comes later.
             */

            const saveButton =
                eventForm.querySelector(
                    ".save-event"
                );


            saveButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Saving...
            `;

            saveButton.disabled = true;


            setTimeout(
                () => {

                    saveButton.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Added
                    `;


                    setTimeout(
                        () => {

                            closeModal();

                            eventForm.reset();

                            saveButton.innerHTML = `
                                <i class="fa-solid fa-plus"></i>
                                Add to Timeline
                            `;

                            saveButton.disabled =
                                false;

                        },
                        700
                    );

                },
                800
            );

        }
    );


    // =====================================================
    // EVENT MENU
    // =====================================================

    document
        .querySelectorAll(".event-menu")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    alert(
                        "Edit and delete options will be connected later."
                    );

                }
            );

        });


    // =====================================================
    // ESCAPE
    // =====================================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                eventModal.classList.contains("open")
            ) {

                closeModal();

            }

        }
    );

});