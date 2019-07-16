const path = require("path");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
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
    res.render(path.join("auth", "login"), {
        pageTitle: "Login",
        path: "/login",
        errorMessage: req.flash("error")
    });
};
exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user) {
                req.flash("error", "Invalid email or password.");
                return res.redirect("/login");
            }
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
    res.render(path.join("auth", "signup"), {
        pageTitle: "Login",
        path: "/signup",
        errorMessage: req.flash("error")
    });
};
exports.postSignup = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(userDoc => {
            if (userDoc) {
                req.flash("error", "This user already exists.");
                return res.redirect("/signup");
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
        })

        .catch(console.log);
};
