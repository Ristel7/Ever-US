const { io } = require("socket.io-client");

const socket = io("http://127.0.0.1:5000");

socket.on("connect", () => {
    console.log("Connected");
    console.log(socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected");
});