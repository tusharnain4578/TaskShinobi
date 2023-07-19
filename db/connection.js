const { Sequelize } = require("sequelize");
require("dotenv").config();

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const dbConn = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  timezone: process.env.TIMEZONE ?? "0",
  logging: false,
});

dbConn
  .authenticate()
  .then(() => {
    console.log("Database has been connected!");
  })
  .catch((error) => {
    console.error("Couldn't connect to the database:", error);
  });

module.exports = dbConn;
