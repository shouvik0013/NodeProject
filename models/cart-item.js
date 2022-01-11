const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../utils/database");

const CartItems = sequelize.define("CartItems", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quatity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = CartItems;
