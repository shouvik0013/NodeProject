const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const sequelize = require("../utils/database");

const OrderItems = sequelize.define("OrderItems", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: DataTypes.INTEGER
});

module.exports = OrderItems;
