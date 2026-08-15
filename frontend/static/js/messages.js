document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const chatLayout =
        document.querySelector(".chat-layout");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const sidebar =
        document.getElementById("messagesSidebar");

    const mobileBack =
        document.getElementById("mobileBack");

    const conversationItems =
        document.querySelectorAll(".conversation-item");

    const messageForm =
        document.getElementById("messageForm");

    const messageInput =
        document.getElementById("messageInput");

    const chatMessages =
        document.getElementById("chatMessages");

    const attachmentInput =
        document.getElementById("attachmentInput");

    const attachmentPreview =
        document.getElementById("attachmentPreview");

    const attachmentName =
        document.getElementById("attachmentName");

    const removeAttachment =
        document.getElementById("removeAttachment");

    const emojiButton =
        document.getElementById("emojiButton");

    const emojiPanel =
        document.getElementById("emojiPanel");

    const voiceButton =
        document.getElementById("voiceButton");

    const conversationSearch =
        document.getElementById("conversationSearch");

    const conversationEmpty =
        document.getElementById("conversationEmpty");

    const filterButtons =
        document.querySelectorAll(
            ".conversation-filter-btn"
        );

    const newMessage =
        document.getElementById("newMessage");


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
    // OPEN CONVERSATION
    // =====================================================

    conversationItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                conversationItems.forEach(
                    conversation => {

                        conversation.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add("active");


                if (
                    window.innerWidth <= 800
                ) {

                    chatLayout.classList.add(
                        "chat-open"
                    );

                }


                const name =
                    item.dataset.name;

                console.log(
                    "Selected conversation:",
                    name
                );

            }
        );

    });


    // =====================================================
    // MOBILE BACK
    // =====================================================

    if (mobileBack) {

        mobileBack.addEventListener(
            "click",
            () => {

                chatLayout.classList.remove(
                    "chat-open"
                );

            }
        );

    }


    // =====================================================
    // SEARCH CONVERSATIONS
    // =====================================================

    conversationSearch.addEventListener(
        "input",
        () => {

            const query =
                conversationSearch.value
                    .trim()
                    .toLowerCase();


            let visibleCount = 0;


            conversationItems.forEach(
                item => {

                    const name =
                        item.dataset.name
                            .toLowerCase();


                    if (
                        name.includes(query)
                    ) {

                        item.style.display =
                            "flex";

                        visibleCount++;

                    } else {

                        item.style.display =
                            "none";

                    }

                }
            );


            conversationEmpty.style.display =
                visibleCount === 0
                    ? "block"
                    : "none";

        }
    );


    // =====================================================
    // CONVERSATION FILTERS
    // =====================================================

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
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


                conversationItems.forEach(
                    item => {

                        if (filter === "all") {

                            item.style.display =
                                "flex";

                            return;

                        }


                        if (filter === "unread") {

                            item.style.display =
                                item.dataset.unread === "true"
                                    ? "flex"
                                    : "none";

                            return;

                        }


                        if (filter === "favorites") {

                            const favorite =
                                item.querySelector(
                                    ".favorite-icon"
                                );

                            item.style.display =
                                favorite
                                    ? "flex"
                                    : "none";

                        }

                    }
                );

            }
        );

    });


    // =====================================================
    // SEND MESSAGE
    // =====================================================

    messageForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const text =
                messageInput.value.trim();


            if (!text) {
                return;
            }


            addMessage(
                text,
                "sent"
            );


            messageInput.value = "";


            scrollToBottom();


            /*
             * Backend / Socket.IO will be
             * connected here later.
             */

            console.log(
                "Message ready to send:",
                text
            );

        }
    );


    // =====================================================
    // ENTER TO SEND
    // =====================================================

    messageInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                messageForm.requestSubmit();

            }

        }
    );


    // =====================================================
    // ADD MESSAGE
    // =====================================================

    function addMessage(
        text,
        type = "sent"
    ) {

        const row =
            document.createElement("div");

        row.className =
            `message-row ${type}`;


        const group =
            document.createElement("div");

        group.className =
            "message-group";


        const bubble =
            document.createElement("div");

        bubble.className =
            "message-bubble";

        bubble.textContent =
            text;


        const meta =
            document.createElement("div");

        meta.className =
            "message-meta";


        const time =
            new Date().toLocaleTimeString(
                [],
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );


        meta.innerHTML =
            `${time}
             <i class="fa-solid fa-check-double read"></i>`;


        group.appendChild(bubble);

        group.appendChild(meta);

        row.appendChild(group);


        chatMessages.appendChild(row);

    }


    // =====================================================
    // ATTACHMENT
    // =====================================================

    attachmentInput.addEventListener(
        "change",
        () => {

            if (
                !attachmentInput.files.length
            ) {

                return;

            }


            const file =
                attachmentInput.files[0];


            attachmentName.textContent =
                file.name;


            attachmentPreview.classList.add(
                "show"
            );

        }
    );


    removeAttachment.addEventListener(
        "click",
        () => {

            attachmentInput.value = "";

            attachmentPreview.classList.remove(
                "show"
            );

        }
    );


    // =====================================================
    // EMOJI
    // =====================================================

    emojiButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            emojiPanel.classList.toggle(
                "open"
            );

        }
    );


    const emojiButtons =
        emojiPanel.querySelectorAll(
            "button"
        );


    emojiButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                messageInput.value +=
                    button.textContent;

                messageInput.focus();

            }
        );

    });


    document.addEventListener(
        "click",
        event => {

            if (
                !emojiPanel.contains(
                    event.target
                ) &&
                event.target !== emojiButton
            ) {

                emojiPanel.classList.remove(
                    "open"
                );

            }

        }
    );


    // =====================================================
    // VOICE BUTTON
    // =====================================================

    voiceButton.addEventListener(
        "click",
        () => {

            alert(
                "Voice messages will be connected with the backend later."
            );

        }
    );


    // =====================================================
    // NEW MESSAGE
    // =====================================================

    newMessage.addEventListener(
        "click",
        () => {

            alert(
                "New conversation will be connected later."
            );

        }
    );


    // =====================================================
    // SCROLL
    // =====================================================

    function scrollToBottom() {

        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    scrollToBottom();


    // =====================================================
    // ESCAPE
    // =====================================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                emojiPanel.classList.remove(
                    "open"
                );

            }

        }
    );

});