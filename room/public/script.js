const socket = io();
let username;

socket.on("chatroom started", (data) => {
    console.log(data)
    document.getElementById("gui").innerHTML =
        `<h1>Welcome to the Chatroom, ${username} </h1>
    <form class="form" class="input">
        <div class="formItem column">
            <label for="msg">Message:</label>
            <input id="msg" type="text" placeholder="min. 1 char" maxlength="100">
        </div>
        <div class="formItem column">
            <label for="clr">Choose your color: </label>
            <input id="clr" type="color">
        </div>
        <div class="formItem column">
            <label for="avtr">Choose your Avatar: </label>
            <span id="avtr" class="material-icons" onclick="showAvatars()">face</span>
        </div>
        <div class="formItem column">
            <button id="btn" type="button" onclick="sendNewMessage()">send</button>
        </div>
    </form>`;
})

socket.on('connect', () => {
    console.log(socket);
    console.log("your user-id: " + socket.id);
});

socket.on("broadcast new message", (data) => {
    updateGUI(data);
})

socket.on("broadcast data", (data) => { // JSON-Parses automatically
    console.log(data);
    updateGUI(data);
});

socket.on("load saved chat", (data) => {
    loadSave(data);
})

socket.on('connect', () => {
    console.log(socket);
    console.log("your user-id: " + socket.id);
});

function sendUsername() {
    username = document.getElementById('user').value;
    let userData = {
        "username": username
    }
    socket.emit("new user", userData)
}

socket.on("awaiting third user", (data) => {
    document.getElementById("gui").innerHTML =
        `<h1>Welcome, ${username}!</h1>
        <p>3 users need to connect...</p>
        `;// <p>You are chatting with ${JSON.stringify(data.username)}</p>
})

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

let avatar = "http://localhost:3000/img/icon-1.png";
function selectAvatar(element) {
    avatar = element.src;
    console.log(avatar);
}

function sendNewMessage() {
    let message = document.getElementById("msg").value;
    let color = document.getElementById("clr").value;
    let data = { username, message, color, avatar };
    socket.emit('new message', data); // Stringifies automatically
    document.getElementById("msg").value = ``;
    updateGUI(data);
}

function updateGUI(data) {
    let fullDate = new Date();
    let time = `${fullDate.getHours()}:${fullDate.getMinutes()} Uhr, ${fullDate.getDate()}.${fullDate.getMonth() + 1}.${fullDate.getFullYear()}`;

    let patt1 = /[A-z]{3,}/;
    let patt2 = /[A-z]+/;
    if (patt1.test(data.username) && patt2.test(data.message)) {
        document.getElementById("chat").innerHTML +=
            `<div class="messageBox">
            <span class="username"><img style="border: 2px solid ${data.color}; border-radius: 100%;" src="${data.avatar}" alt="${data.avatar}">
            ${data.username}: ${time}</span><span class="message">${data.message}</span>
            </div>`
    } else {
        alert("wrong input");
    }
}

function loadSave(data) {
    document.getElementById("chat").innerHTML = "";
    for (let i = 0; i < data.messages.length; i++) {
        document.getElementById("chat").innerHTML +=
            `<div class="messageBox">
            <span class="username"><img style="border: 2px solid ${data.messages[i].color}; border-radius: 100%;" src="${data.messages[i].avatar}" alt="${data.messages[i].avatar}">
            ${data.messages[i].username}: ${data.messages[i].date}</span><span class="message">${data.messages[i].message}</span>
            </div>`
    }
}