const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const sequelize = require("../utils/database");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = Cart;
