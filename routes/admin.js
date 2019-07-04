const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();

router.get("/add-product", adminController.getAddProduct);
router.get("/products", adminController.getProducts);
router.get("/edit-product/:id", adminController.getEditProduct);

router.post("/delete-product", adminController.deleteProduct);
router.post("/edit-product", adminController.postEditProduct);
router.post("/add-product", adminController.postAddProduct);

exports.router = router;
