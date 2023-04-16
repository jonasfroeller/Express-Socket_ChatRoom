// .on für abfangen
// .emit zum feuern
const path = require('path');
const express = require('express');
const fs = require("fs");
const http = require('http');

const port = process.env.PORT || 5000;
const jsonpath = path.join(__dirname, 'src/chatroomSave.json');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server); // (http) heißt: io(http) => Function Call

app.use(express.static(path.join(__dirname, 'public')));

let roomId = 1;
let clients = 0;
let client_waiting1 = false;
let client_waiting2 = false;
let client_waiting_socket1 = null;
let client_waiting_socket2 = null;

function enterRoom(socket1, socket2, socket3) {
    console.log("Raum wurde erstellt!");
    let roomName = "Chatroom" + roomId;
    socket1?.join(roomName);
    socket2?.join(roomName);
    socket3?.join(roomName);
    roomId++;

    if (socket1 != null && socket2 != null && socket3 != null) {
        io.to(roomName).emit("chatroom started", true);
    }

    socket1?.on("new message", (data) => {
        socket1.broadcast.to(roomName).emit("broadcast new message", data);

        Chat.addMessage(data.username, data.message, data.avatar, data.color);

        fs.writeFile(jsonpath, JSON.stringify(Chat, null, 2), 'utf8', (error) => {
            if (error) throw error;
            console.log("*data has been saved*");
        })
    });

    socket2?.on("new message", (data) => {
        socket2.broadcast.to(roomName).emit("broadcast new message", data);

        Chat.addMessage(data.username, data.message, data.avatar, data.color);

        fs.writeFile(jsonpath, JSON.stringify(Chat, null, 2), 'utf8', (error) => {
            if (error) throw error;
            console.log("*data has been saved*");
        })
    });

    socket3?.on("new message", (data) => {
        socket3.broadcast.to(roomName).emit("broadcast new message", data);

        Chat.addMessage(data.username, data.message, data.avatar, data.color);

        fs.writeFile(jsonpath, JSON.stringify(Chat, null, 2), 'utf8', (error) => {
            if (error) throw error;
            console.log("*data has been saved*");
        })
    });
}

io.on('connection', (socket) => {
    socket.emit("load saved chat", Chat);

    clients++;
    if (clients > 0) {
        console.log(`*user ${socket.id} connected*`);
        console.log("Users: " + clients);
    }

    socket.on('disconnect', () => {
        clients--;
        console.log(`*user ${socket.id} disconnected*`);
        console.log("Users: " + clients);
    });

    socket.on("new user", (userData) => { // JSON-Parses automatically
        if (client_waiting1 && client_waiting2) {
            enterRoom(socket, client_waiting_socket1, client_waiting_socket2);
            client_waiting1 = false;
            client_waiting2 = false;
            client_waiting_socket1 = null;
            client_waiting_socket2 = null;
        } else {
            if (client_waiting1) {
                client_waiting2 = true;
                client_waiting_socket2 = socket;
            } else {
                client_waiting1 = true;
                client_waiting_socket1 = socket;
            }

            socket.emit("awaiting third user", userData);
        }
    });

/*     socket.on("new message", (userData) => { // JSON-Parses automatically
        socket.broadcast.emit("broadcast data", userData); // Stringifies automatically // io.emit => an alle: auch an mich selbst => socket.broadcast.emit: alle außer ich
        console.log(userData);

        let patt1 = /[A-z]{3,}/;
        let patt2 = /[A-z]+/;
        if (patt1.test(userData.username) && patt2.test(userData.message)) {
            console.log("Valid user: " + userData.username);
            console.log("Valid message: " + userData.message);
            Chat.addMessage(userData.username, userData.message, userData.avatar, userData.color);

            // Save Data
            fs.writeFile(jsonpath, JSON.stringify(Chat, null, 2), 'utf8', (error) => {
                if (error) throw error;
                console.log("*data has been saved*");
            })
        } else {
            console.error("*wrong input*");
        }

    }); */
});

server.listen(port, () => {
    console.log("listening to localhost:" + port);
});

/**
 *  Simple class to manage a ChatRoom messages
 */
class ChatRoom {
    /**
     * inits an empty ChatRoom messages
     */
    constructor() {
        this.messages = new Array();
    }
    /**
     * Save message to Array
     * @param {String} username
     * @param {String} message
     */
    addMessage(u, m, a, c) {
        let fullDate = new Date();
        let time = `${fullDate.getHours()}:${fullDate.getMinutes()} Uhr, ${fullDate.getDate()}.${fullDate.getMonth() + 1}.${fullDate.getFullYear()}`;
        let d = time;

        let newMessage = {
            username: u,
            message: m,
            avatar: a,
            color: c,
            date: d
        };
        this.messages.push(newMessage);
    }
}
let Chat = new ChatRoom();

if (fs.existsSync(jsonpath)) {
    fs.readFile(jsonpath, 'utf8', (error, data_String) => {
        if (error) throw error;
        let data = JSON.parse(data_String);
        for (let i = 0; i < data.messages.length; i++) {
            Chat.addMessage(data.messages[i].username, data.messages[i].message, data.messages[i].avatar, data.messages[i].color);
        }
        console.log("*data has been recovered*");
        console.log(Chat.messages);
    });
}