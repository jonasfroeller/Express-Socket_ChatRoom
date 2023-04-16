# Chat Room with Websockets

A simple chat room hosted with express. Messages are stored locally with the FS-module. Messages are shared with <a href="https://socket.io/">socket.io</a>.

Technologies: HTML, CSS, JS, NodeJS, Express, FS-module, JSON, SocketIO-Websocket

## Versions

### Huge Chat Room (default)

Everybody that views the site can write in the same chat.

### Chat Rooms (room)

The second version requires 3 connections to the site to unlock a chatroom for them. Every room has 3 slots and if one is full, another one starts filling up.
