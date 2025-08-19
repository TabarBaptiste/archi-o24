const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(dbConfig.url, {
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

// Initialize db object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import and initialize models
db.user = require('./user.model')(sequelize, Sequelize);

module.exports = db;
