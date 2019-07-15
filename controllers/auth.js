const path = require("path");
const User = require("../models/user");

exports.getLogin = (req, res) => {
    res.render(path.join("auth", "login"), {
        pageTitle: "Login",
        path: "/login",
        isAuthenticated: req.isLoggedIn
    });
};
exports.postLogin = (req, res) => {
    User.findById("5d2882ec5bac932fe46e6c95")
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
                console.log(err);
                res.redirect("/");
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
