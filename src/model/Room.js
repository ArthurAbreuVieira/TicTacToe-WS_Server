const { Model, DataTypes } = require('sequelize');

class Room extends Model {
  static init(sequelize) {
    super.init({
      data: DataTypes.JSON
    }, { sequelize });
  }
}

module.exports = Room;