const Sequelize = require('sequelize');
const config = require('../config/database');

const Player = require('../model/Player');

const connection = new Sequelize(config.database, config.user, config.password, config);

Player.init(connection);

module.exports = connection;