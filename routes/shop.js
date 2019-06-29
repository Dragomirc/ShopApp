const express = require("express");
const path = require("path");
const rootDir = require("../utils/path");
const adminData = require("./admin");
const router = express.Router();

router.get("/", (req, res) => {
    const products = adminData.products;
    res.render("shop", {
        prods: products,
        pageTitle: "Shop",
        path: "/",

        hasProducts: products.length > 0,
        activeShop: true,
        productCss: true
    });
});

module.exports = router;
