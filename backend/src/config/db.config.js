// Database configuration
module.exports = {
  url: process.env.DATABASE_URL || "postgres://postgres:postgres@db:5432/angular_db",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
