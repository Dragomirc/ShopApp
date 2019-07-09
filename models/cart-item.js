const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const CartItem = sequelize.define("cart-item", {
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

module.exports = CartItem;
