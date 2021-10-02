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
  let room;
  console.log(`New player ${socket.id} has been connected!`);

  Player.createPlayer(socket.id);
  room = await Room.insertInRoom(socket.id);

  if(room === undefined) 
    room = await Room.createRoom(socket.id);
  
  const roomData = await Room.getRoom(room);
  Room.sendJoinedData(roomData, socket);

  // Socket.io Events
  socket.on("connect_second", msg => {
    Player.sendDataToSecondPlayer(socket, msg);
  });

  socket.on("update_game", async msg => {
    Room.updateGame(socket, msg);
  });
  
  socket.on("close_connection", async gameData => {
    socket.disconnect();
    socket.to(gameData.opponentConn).emit("close_connection");
    Player.deletePlayer(socket.id);

    if (gameData !== null) {
      if (gameData.room !== undefined && gameData.opponentConn !== undefined) {
        const room = await Room.getRoom(gameData.room);
        if (room !== null) {
          if (room.data.player1.conn !== '' && room.data.player2.conn !== '') {
            Room.deleteRoom(gameData.room);
          }
        }
      } else {
        const rooms = await Room.getAll();
        for (let room of rooms) {
          if (room.data.player1.conn === socket.id || room.data.player2.conn === socket.id) {
            console.log('ladsjflsdkfjasldkfjlasdkjfsçadkfjsdlkfjsdlkfjsaf');
            await Room.deleteRoom(room.id);
            break;
          }
        }
      }
    } 
    console.log(`Player ${socket.id} has been disconnected!`);
  });

});

server.listen(7811, () => {
  console.log("[SERVER IS RUNNING]");
})