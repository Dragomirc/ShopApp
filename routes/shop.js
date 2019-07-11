const express = require("express");
const shopController = require("../controllers/shop");
const router = express.Router();

router.get("/products", shopController.getProducts);
router.get("/", shopController.getIndex);
router.get("/cart", shopController.getCart);
// router.get("/orders", shopController.getOrders);
router.get("/products/:id", shopController.getProductDetails);

router.post("/cart", shopController.postAddToCart);
// router.post("/cart-delete-item", shopController.deleteCartItem);
// router.post("/create-order", shopController.postOrder);
module.exports = router;
