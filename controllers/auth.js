const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res) => {
    res.render(path.join("auth", "login"), {
        pageTitle: "Login",
        path: "/login",
        isAuthenticated: req.isLoggedIn
    });
};
exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    let tempUser;
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.redirect("/login");
            }
            const hash = user.password;
            return bcrypt
                .compare(password, hash)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = tempUser;
                        req.session.save(err => {
                            if (err) {
                                console.log(err);
                            }
                            res.redirect("/");
                        });
                    } else {
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
        isAuthenticated: req.isLoggedIn
    });
};
exports.postSignup = (req, res) => {
    const { email, password, confirmPassword } = req.body;
    User.findOne({ email })
        .then(userDoc => {
            if (userDoc) {
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
                });
        })

        .catch(console.log);
};
