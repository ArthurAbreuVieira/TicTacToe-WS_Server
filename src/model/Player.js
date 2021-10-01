const { Model, DataTypes } = require('sequelize');

class Player extends Model {
  static init(sequelize) {
    super.init({
      connId: DataTypes.INTEGER
    }, { sequelize });
  }
}

module.exports = Player;