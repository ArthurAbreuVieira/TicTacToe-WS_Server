const Player = require('../model/Player');

class PlayerService {

  static async createPlayer(id) {
    await Player.create({
      connId: id
    });
  }

  static async sendDataToSecondPlayer(socket, msg) {
    if(msg.sender === socket.id) {
      socket.to(msg.opponent).emit("join", {
        room: msg.room,
        player1: msg.player1,
        player2: msg.player2,
        sender: msg.sender,
        opponent: msg.opponent,
        me: msg.opponent,
        turn: msg.turn,
        board: msg.board
      });
    }
  }

}

module.exports = PlayerService;