// .on für abfangen
// .emit zum feuern
const path = require('path');
const express = require('express');
const fs = require("fs");
const http = require('http');

const port = process.env.PORT || 4000;
const jsonpath = path.join(__dirname, 'src/chatroomSave.json');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server); // (http) heißt: io(http) => Function Call

app.use(express.static(path.join(__dirname, 'public')));

let clients = 0;
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

    socket.on("new message", (userData) => { // JSON-Parses automatically

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

    });
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