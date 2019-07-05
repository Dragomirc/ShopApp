const Sequalize = require("sequelize");
const sequalize = new Sequalize(
    "shop-app-schema",
    "root",
    process.env.DATABASE_PASSWORD,
    { dialect: "mysql", host: "localhost" }
);

module.exports = sequalize;
