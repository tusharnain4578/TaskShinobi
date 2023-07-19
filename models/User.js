const bcrypt = require("bcryptjs");
const dbConn = require("../db/connection");
const { DataTypes } = require("sequelize");
const Task = require("./Task");

const User = dbConn.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Hook to hash password before saving
User.beforeSave(async (user) => {
  if (user.changed("password")) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
});

User.prototype.verifyPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
