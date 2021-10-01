const Sequelize = require('sequelize');
const config = require('../config/database');

const Room = require('../model/Room');
const Player = require('../model/Player');

const connection = new Sequelize(config.database, config.user, config.password, config);

Room.init(connection);
Player.init(connection);

module.exports = connection;