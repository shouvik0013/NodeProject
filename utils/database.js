const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "ddReb@0660", {
  dialect: "mysql",
  host: "localhost",
  port: 3306,
});

module.exports = sequelize;
