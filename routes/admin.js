const express = require("express");
const isAuth = require("../middleware/is-auth");
const adminController = require("../controllers/admin");
const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);
router.get("/products", isAuth, adminController.getProducts);
router.get("/edit-product/:id", isAuth, adminController.getEditProduct);

router.post("/delete-product", isAuth, adminController.deleteProduct);
router.post("/edit-product", isAuth, adminController.postEditProduct);
router.post("/add-product", isAuth, adminController.postAddProduct);

exports.router = router;
