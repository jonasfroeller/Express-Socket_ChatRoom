function showAvatars() {
    // document.getElementsByClassName("settings")[0].classList.toggle("hide");
    if (document.getElementsByClassName("settings")[0].classList.contains("slideIn-bottom")) {
        document.getElementsByClassName("settings")[0].classList.remove("slideIn-bottom");
        document.getElementsByClassName("settings")[0].classList.add("slideOut-bottom");
        document.getElementsByClassName("settings")[0].style = "bottom: -50vh";
    } else {
        document.getElementsByClassName("settings")[0].classList.add("slideIn-bottom");
        document.getElementsByClassName("settings")[0].classList.remove("slideOut-bottom");
        document.getElementsByClassName("settings")[0].style = "bottom: 10vh";
    }
}

let host = "";
if (window.location.hostname === "localhost") {
    host = "http://localhost:4000";
} else {
    host = "https://express-socket-chat-room-default.glitch.me";
}

let avatar = `${host}/img/icon-1.png`;
function selectAvatar(element) {
    avatar = element.src;
    console.log(avatar);
}

const socket = io();

socket.on('connect', () => {
    console.log(socket);
    console.log("your user-id: " + socket.id);
});

socket.on("broadcast data", (userData) => { // JSON-Parses automatically
    console.log(userData);
    updateGUI(userData);
});

socket.on("load saved chat", (userData) => {
    loadSave(userData);
})

/**
 * Sends message to server and clears input field
 */
function sendNewMessage() {
    let message = document.getElementById("msg").value;
    let username = document.getElementById("user").value;
    let color = document.getElementById("clr").value;
    let userData = { username, message, color, avatar };
    socket.emit('new message', userData); // Stringifies automatically
    document.getElementById("msg").value = ``;
    updateGUI(userData);
}

function updateGUI(userData) {
    let fullDate = new Date();
    let time = `${fullDate.getHours()}:${fullDate.getMinutes()} Uhr, ${fullDate.getDate()}.${fullDate.getMonth() + 1}.${fullDate.getFullYear()}`;

    let patt1 = /[A-z]{3,}/;
    let patt2 = /[A-z]+/;
    if (patt1.test(userData.username) && patt2.test(userData.message)) {
        document.getElementById("chat").innerHTML +=
            `<div class="messageBox">
            <span class="username"><img style="border: 2px solid ${userData.color}; border-radius: 100%;" src="${userData.avatar}" alt="${userData.avatar}">
            ${userData.username}: ${time}</span><span class="message">${userData.message}</span>
            </div>`
    } else {
        alert("wrong input");
    }
}

function loadSave(userData) {
    document.getElementById("chat").innerHTML = "";
    for (let i = 0; i < userData.messages.length; i++) {
        document.getElementById("chat").innerHTML +=
            `<div class="messageBox">
            <span class="username"><img style="border: 2px solid ${userData.messages[i].color}; border-radius: 100%;" src="${userData.messages[i].avatar}" alt="${userData.messages[i].avatar}">
            ${userData.messages[i].username}: ${userData.messages[i].date}</span><span class="message">${userData.messages[i].message}</span>
            </div>`
    }
}