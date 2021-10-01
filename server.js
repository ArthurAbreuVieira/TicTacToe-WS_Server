const express = require('express');
const http = require('http');
const socket = require('socket.io');

require('./src/database');

const Room = require('./src/service/RoomService');
const Player = require('./src/service/PlayerService');

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

  Player.createPlayer(socket.id);
  room = await Room.insertInRoom(socket.id);

  if(room === undefined) 
    room = await Room.createRoom(socket.id);
  
  const roomData = await Room.getRoom(room);
  Room.sendJoinedData(roomData, socket);
});

server.listen(7811, () => {
  console.log("[SERVER IS RUNNING]");
})