const { spawn } = require('child_process');
const express = require('express');

const app = express();
app.use(express.static('public'));

const defaultServerPath = 'default/index.js';
const defaultServerProcess = spawn('node', [defaultServerPath], { env: { PORT: 4000 } });

defaultServerProcess.on('exit', (code) => {
  console.log(`Der erste Server wurde mit dem Code ${code} beendet!`);
});

const roomServerPath = 'room/index.js';
const roomServerProcess = spawn('node', [roomServerPath], { env: { PORT: 5000 } });

roomServerProcess.on('exit', (code) => {
  console.log(`Der zweite Server wurde mit dem Code ${code} beendet!`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Reverse proxy server running on ${port}`);
});