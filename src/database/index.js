const Sequelize = require('sequelize');
const config = require('../config/database');

const connection = new Sequelize(config.database, config.user, config.password, config);

module.exports = connection;