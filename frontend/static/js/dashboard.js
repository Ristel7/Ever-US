async function loadProfile() {

    const response = await api("/users/profile");

    if (!response.success) {

        return;

    }

    const user = response.data.user;

    document.getElementById("userName").innerText = user.name;

    document.getElementById("userEmail").innerText = user.email;

    document.getElementById("profileImage").src = user.profile_image;

}