const express = require("express");
const { check, body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");
const router = express.Router();

router.get(
    "/login",

    authController.getLogin
);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getResetPassword);
router.get("/reset/:token", authController.getNewPassword);

router.post(
    "/login",
    [
        body("password")
            .isLength({ min: 1 })
            .withMessage("The password cannot be empty.")
            .trim(),
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email")
            .normalizeEmail()
    ],
    authController.postLogin
);
router.post(
    "/signup",
    [
        check("email")
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject("This user already exists.");
                    }
                });
            })
            .normalizeEmail(),
        body(
            "password",
            "Please enter a password with only numbers and text and at least 5 characters"
        )
            .isLength({ min: 6 })
            .isAlphanumeric()
            .trim(),
        body("confirmPassword")
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords have to match");
                }
                return true;
            })
            .trim()
    ],
    authController.postSignup
);
router.post("/reset", authController.postResetPassword);
router.post("/new-password", authController.updatePassword);
router.post("/logout", authController.logout);

module.exports = router;
