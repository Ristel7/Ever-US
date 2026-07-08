async function loadSpaces() {

    const response = await api("/spaces");

    const container = document.getElementById("spacesContainer");

    container.innerHTML = "";

    response.data.spaces.forEach(space => {

        container.innerHTML += `
            <div class="space-card">

                <img
                    src="${space.cover_image || '/static/images/default-cover.jpg'}">

                <h3>${space.space_name}</h3>

                <p>${space.space_type || "General"}</p>

                <button onclick="openChat('${space._id}')">
                    Open Chat
                </button>

            </div>
        `;
    });
}