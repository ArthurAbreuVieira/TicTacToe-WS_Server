const Room = require('../model/Room');

class RoomService {
  
  static async createRoom(player) {
    const data = {
      "player1": {
        "conn": player,
        "nick": ""
      },
      "player2": {
        "conn": "",
        "nick": ""
      },
      "board": [
        [
          { "color": "#88e439", "value": "", "bg": "rgba(0, 0, 0, .6)" },
          { "color": "#88e439", "value": "", "bg": "rgba(0, 0, 0, .3)" },
          { "color": "#88e439", "value": "", "bg": "rgba(0, 0, 0, .6)" }
        ],
        [
          { "color": "#88e439", "value": "", "bg": "rgba(0, 0, 0, .3)" },
          { "color": "#88e439", "value": "", "bg": "rgba(0, 0, 0, .6)" },
          { "color": "#88e439", "value": "", "bg": "rgba(0, 0, 0, .3)" }
        ],
        [
          { "color": "#88e439", "value": "", "bg": "rgba(0, 0, 0, .6)" },
          { "color": "#88e439", "value": "", "bg": "rgba(0, 0, 0, .3)" },
          { "color": "#88e439", "value": "", "bg": "rgba(0, 0, 0, .6)" }
        ]
      ],
      "turn": Math.round(Math.random() * 1) + 1,
      "winner": ""
    }
    const room = await Room.create({ data });
    return room.id;
  }

  static async insertInRoom(id) {
    const rooms = await Room.findAll();
    for(let room of rooms) {
      let data = room.data;
      let roomId = room.id;
      if(data.player1.conn === '' || data.player2.conn === '') {
        if(data.player1.conn === '')
          data.player1.conn = id;
        else 
          data.player2.conn = id;
        
        const roomData = await Room.findByPk(roomId);
        roomData.data = data;
        await roomData.save();
  
        return roomId;
      }
    }
  
    return undefined;
  }

  static sendJoinedData(roomData, socket) {
    if(roomData.data.player1.conn !== '' && roomData.data.player2.conn !== '') {
      if(roomData.data.player1.conn === socket.id || roomData.data.player2.conn === socket.id) {
        socket.to(socket.id !== roomData.data.player1.conn ? roomData.data.player1.conn : roomData.data.player2.conn).emit("join", {
          room: roomData.id,
          player1: roomData.data.player1.conn,
          player2: roomData.data.player2.conn,
          sender: socket.id,
          opponent: socket.id !== roomData.data.player1.conn ? roomData.data.player1.conn : roomData.data.player2.conn,
          turn: roomData.data.turn,
          board: roomData.data.board,
          firstReceiver: true
        });
      }
    }
  }

  static async getRoom(id) {
    const room = await Room.findByPk(id);
    return room;
  }

  static async updateGame(socket, msg) {
    const game = await this.getRoom(msg.data.room);
    game.data.board = msg.data.board;
    game.save();
    
    if(socket.id === msg.from) {
      console.log(`\n\n\n${msg.from}`);
      socket.to(msg.to).emit("update_game", msg.data);
    }
  }

  static async getAll() {
    const rooms = await Room.findAll();
    return rooms;
  }
  
  static async resetRoom(id) {
    const room = await Room.findByPk(id);
    room.data.player1.conn = '';
    room.data.player2.conn = '';
    room.data.turn = '';
    await room.save();
  }

  static async deleteRoom(id) {
    const room = await this.getRoom(id);
    await room.destroy();
  }

}

module.exports = RoomService;