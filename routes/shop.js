const express = require("express");
const isAuth = require("../middleware/is-auth");
const shopController = require("../controllers/shop");
const router = express.Router();

router.get("/products", shopController.getProducts);
router.get("/", shopController.getIndex);
router.get("/cart", isAuth, shopController.getCart);
router.get("/orders", isAuth, shopController.getOrders);
router.get("/products/:id", shopController.getProductDetails);
router.get("/orders/:orderId", isAuth, shopController.getInvoice);
router.get("/checkout", isAuth, shopController.getCheckout);
router.post("/cart", isAuth, shopController.postAddToCart);
router.post("/cart-delete-item", isAuth, shopController.deleteCartItem);
router.post("/create-order", isAuth, shopController.postOrder);
module.exports = router;
