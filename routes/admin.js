const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const adminController = require("../controllers/admin");
const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);
router.get("/products", isAuth, adminController.getProducts);
router.get("/edit-product/:id", isAuth, adminController.getEditProduct);

router.post("/delete-product", isAuth, adminController.deleteProduct);
router.post(
    "/edit-product",
    isAuth,
    [
        body("title", "Title should be greater than 5 characters.")
            .isString()
            .isLength({ min: 5 })

            .trim(),
        // body("imageUrl")
        //     .trim()
        //     .isURL()
        //     .withMessage("Image Url should be a valid url."),
        body("description")
            .isLength({ min: 5 })
            .withMessage("Description should be greater than 5 characters.")
            .trim(),
        body("price")
            .isFloat()
            .withMessage("Price should be a number.")
            .trim()
    ],
    adminController.postEditProduct
);
router.post(
    "/add-product",
    isAuth,
    [
        body("title")
            .isLength({ min: 5 })
            .withMessage("Title should be greater than 5 characters.")
            .trim(),
        // body("imageUrl")
        //     .trim()
        //     .isURL()
        //     .withMessage("Image Url should be a valid url."),
        body("description")
            .isLength({ min: 5 })
            .withMessage("Description should be greater than 5 characters.")
            .trim(),
        body("price")
            .isFloat()
            .withMessage("Price should be a number.")
            .trim()
    ],
    adminController.postAddProduct
);

exports.router = router;
