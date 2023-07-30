const dbConn = require("../db/connection");
const { DataTypes } = require("sequelize");

const Task = dbConn.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  task: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  isImportant: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM("complete", "pending"),
    allowNull: false,
    defaultValue: "pending",
  },
});

Task.getAllTasks = async function (userId, limit = null, offset = null) {
  let options = {
    where: { userId: userId },
    order: [["createdAt", "DESC"]],
  };

  if (limit) options.limit = limit;

  if (offset) options.offset = offset;

  return await this.findAll(options);
};

module.exports = Task;
