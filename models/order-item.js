const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const OrderItem = sequelize.define("order-item", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = OrderItem;
