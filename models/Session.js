const dbConn = require("../db/connection");
const { DataTypes } = require("sequelize");

const Session = dbConn.define("Session", {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  expires: DataTypes.DATE,
  data: DataTypes.TEXT,
});

module.exports = Session;
