document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const uploadModal =
        document.getElementById("uploadModal");

    const openUpload =
        document.getElementById("openUpload");

    const emptyUpload =
        document.getElementById("emptyUpload");

    const closeUpload =
        document.getElementById("closeUpload");

    const cancelUpload =
        document.getElementById("cancelUpload");

    const memoryFile =
        document.getElementById("memoryFile");

    const filePreview =
        document.getElementById("filePreview");

    const saveMemory =
        document.getElementById("saveMemory");

    const dropzone =
        document.getElementById("dropzone");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const sidebar =
        document.querySelector(".memories-sidebar");


    // =====================================================
    // MODAL
    // =====================================================

    function openModal() {

        uploadModal.classList.add("open");

        document.body.style.overflow = "hidden";

    }


    function closeModal() {

        uploadModal.classList.remove("open");

        document.body.style.overflow = "";

    }


    if (openUpload) {

        openUpload.addEventListener(
            "click",
            openModal
        );

    }


    if (emptyUpload) {

        emptyUpload.addEventListener(
            "click",
            openModal
        );

    }


    if (closeUpload) {

        closeUpload.addEventListener(
            "click",
            closeModal
        );

    }


    if (cancelUpload) {

        cancelUpload.addEventListener(
            "click",
            closeModal
        );

    }


    uploadModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === uploadModal
            ) {

                closeModal();

            }

        }
    );


    // =====================================================
    // FILE SELECTION
    // =====================================================

    memoryFile.addEventListener(
        "change",
        () => {

            showPreview(
                memoryFile.files
            );

        }
    );


    function showPreview(files) {

        filePreview.innerHTML = "";

        if (!files || files.length === 0) {

            filePreview.classList.remove(
                "show"
            );

            saveMemory.disabled = true;

            return;

        }


        filePreview.classList.add(
            "show"
        );

        saveMemory.disabled = false;


        Array.from(files).forEach(
            (file) => {

                const preview =
                    document.createElement(
                        "div"
                    );

                preview.className =
                    "preview-item";


                const url =
                    URL.createObjectURL(
                        file
                    );


                if (
                    file.type.startsWith(
                        "video/"
                    )
                ) {

                    const video =
                        document.createElement(
                            "video"
                        );

                    video.src = url;

                    video.muted = true;

                    preview.appendChild(
                        video
                    );

                } else {

                    const image =
                        document.createElement(
                            "img"
                        );

                    image.src = url;

                    image.alt =
                        file.name;

                    preview.appendChild(
                        image
                    );

                }


                filePreview.appendChild(
                    preview
                );

            }
        );

    }


    // =====================================================
    // DRAG & DROP
    // =====================================================

    [
        "dragenter",
        "dragover"
    ].forEach(
        (eventName) => {

            dropzone.addEventListener(
                eventName,
                (event) => {

                    event.preventDefault();

                    dropzone.classList.add(
                        "dragging"
                    );

                }
            );

        }
    );


    [
        "dragleave",
        "drop"
    ].forEach(
        (eventName) => {

            dropzone.addEventListener(
                eventName,
                (event) => {

                    event.preventDefault();

                    dropzone.classList.remove(
                        "dragging"
                    );

                }
            );

        }
    );


    dropzone.addEventListener(
        "drop",
        (event) => {

            const files =
                event.dataTransfer.files;

            memoryFile.files =
                files;

            showPreview(files);

        }
    );


    // =====================================================
    // SAVE MEMORY
    // =====================================================

    saveMemory.addEventListener(
        "click",
        () => {

            if (
                memoryFile.files.length === 0
            ) {

                return;

            }


            /*
             * UI-only for now.
             *
             * We will connect this to
             * Cloudinary / memory API later.
             */

            saveMemory.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Saving...
            `;

            saveMemory.disabled = true;


            setTimeout(
                () => {

                    saveMemory.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Saved
                    `;


                    setTimeout(
                        () => {

                            closeModal();

                            memoryFile.value = "";

                            filePreview.innerHTML = "";

                            filePreview.classList.remove(
                                "show"
                            );


                            saveMemory.innerHTML = `
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                                Save Memory
                            `;

                            saveMemory.disabled = true;

                        },
                        700
                    );

                },
                900
            );

        }
    );


    // =====================================================
    // FILTER BUTTONS
    // =====================================================

    const filterButtons =
        document.querySelectorAll(
            ".filter-button"
        );


    filterButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    filterButtons.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    console.log(
                        "Selected filter:",
                        button.dataset.filter
                    );

                }
            );

        }
    );


    // =====================================================
    // SEARCH
    // =====================================================

    const searchInput =
        document.getElementById(
            "memorySearch"
        );


    searchInput.addEventListener(
        "input",
        () => {

            console.log(
                "Memory search:",
                searchInput.value
            );

        }
    );


    // =====================================================
    // VIEW TOGGLE
    // =====================================================

    const viewButtons =
        document.querySelectorAll(
            ".view-option"
        );


    viewButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    viewButtons.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    console.log(
                        "View:",
                        button.dataset.view
                    );

                }
            );

        }
    );


    // =====================================================
    // CREATE ALBUM
    // =====================================================

    const createAlbum =
        document.getElementById(
            "createAlbum"
        );


    createAlbum.addEventListener(
        "click",
        () => {

            alert(
                "Album creation will be connected later."
            );

        }
    );


    // =====================================================
    // MOBILE SIDEBAR
    // =====================================================

    if (mobileMenu) {

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
    // ESCAPE KEY
    // =====================================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                uploadModal.classList.contains(
                    "open"
                )
            ) {

                closeModal();

            }

        }
    );

});