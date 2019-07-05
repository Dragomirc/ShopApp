const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Cart = sequelize.define("cart", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Cart;
