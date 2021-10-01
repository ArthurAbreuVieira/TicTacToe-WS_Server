const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", async socket => {
  console.log(`New player ${socket.id} has been connected!`);
});

server.listen(7811, () => {
  console.log("[SERVER IS RUNNING]");
})