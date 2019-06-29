const express = require("express");
const adminData = require("./admin");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("shop", {
        pageTitle: "Products",
        prods: adminData.products,
        path: "/"
    });
});

module.exports = router;
