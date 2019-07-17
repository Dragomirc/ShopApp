const path = require("path");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const User = require("../models/user");

const transporter = nodemailer.createTransport(
    sendGridTransport({
        auth: {
            api_key: process.env.SEND_GRID_KEY
        }
    })
);

exports.getLogin = (req, res) => {
    const errorMessage = req.flash("error")[0];
    res.render(path.join("auth", "login"), {
        pageTitle: "Login",
        path: "/login",
        errorMessage,
        oldInput: {
            email: "",
            password: ""
        },
        validationErrors: []
    });
};
exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render(path.join("auth", "login"), {
            pageTitle: "Login",
            path: "/login",
            errorMessage: errors.array()[0].msg,
            oldInput: { email, password },
            validationErrors: errors.array()
        });
    }
    User.findOne({ email })
        .then(user => {
            const hash = user.password;
            return bcrypt
                .compare(password, hash)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        req.session.save(err => {
                            if (err) {
                                console.log(err);
                            }
                            res.redirect("/");
                        });
                    } else {
                        req.flash("error", "Invalid email or password.");
                        res.redirect("/login");
                    }
                })
                .catch(err => {
                    if (err) {
                        console.log(err);
                        res.redirect("/login");
                    }
                });
        })
        .catch(console.log);
};
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });
};
exports.getSignup = (req, res) => {
    const errorMessage = req.flash("error")[0];
    res.render(path.join("auth", "signup"), {
        pageTitle: "Signup",
        path: "/signup",
        errorMessage,
        oldInput: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: []
    });
};
exports.postSignup = (req, res) => {
    const { email, password, confirmPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render(path.join("auth", "signup"), {
            pageTitle: "Signup",
            path: "/signup",
            errorMessage: errors.array()[0].msg,
            oldInput: { email, password, confirmPassword },
            validationErrors: errors.array()
        });
    }
    return bcrypt
        .hash(password, 12)
        .then(password => {
            const user = new User({
                email,
                password,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(() => {
            res.redirect("/login");
            return transporter.sendMail({
                to: email,
                from: "shop@node-complete.com",
                subject: "Signup succeeded!",
                html: "<h1>You successfully signed up</h1>"
            });
        })
        .catch(console.log);
};
exports.getResetPassword = (req, res) => {
    const errorMessage = req.flash("error")[0];
    res.render(path.join("auth", "reset"), {
        pageTitle: "Reset password",
        path: "/reset",
        errorMessage
    });
};
exports.postResetPassword = (req, res) => {
    const { email } = req.body;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect("/reset");
        }
        const token = buffer.toString("hex");
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    req.flash("error", "No account with that email found.");
                    return res.redirect("/reset");
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600 * 1000;
                return user.save();
            })

            .then(() => {
                res.redirect("/");
                return transporter.sendMail({
                    to: email,
                    from: "shop@node-complete.com",
                    subject: "Password reset",
                    html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                    `
                });
            })
            .catch(console.log);
    });
};

exports.getNewPassword = (req, res, next) => {
    const errorMessage = req.flash("error")[0];
    const { token } = req.params;
    User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() }
    }).then(user => {
        if (!user) {
            req.flash("error", "Please request a new password reset");
            return res.redirect("/login");
        }
        res.render(path.join("auth", "new-password"), {
            pageTitle: "New password",
            path: "/new-password",
            errorMessage,
            userId: user._id.toString(),
            passwordToken: token
        });
    });
};

exports.updatePassword = (req, res) => {
    const { password, userId, passwordToken } = req.body;
    User.findOne({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() }
    })
        .then(user => {
            if (!user) {
                req.flash("error", "Please request a new password reset");
                return res.redirect("/login");
            }
            return bcrypt
                .hash(password, 12)
                .then(hash => {
                    user.password = hash;
                    user.resetToken = undefined;
                    user.resetTokenExpiration = undefined;
                    return user.save();
                })
                .then(() => {
                    res.redirect("/login");
                })
                .catch(console.log);
        })
        .catch(console.log);
};
