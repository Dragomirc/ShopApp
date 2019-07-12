require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const adminHandlers = require("./routes/admin");
const shopHandlers = require("./routes/shop");
const errorController = require("./controllers/errors");
const User = require("./models/user");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    if (!req.user) {
        User.findById("5d2882ec5bac932fe46e6c95").then(user => {
            req.user = user;
            next();
        });
    } else {
        next();
    }
});
app.use("/admin", adminHandlers.router);
app.use(shopHandlers);

app.use(errorController.get404);

mongoose
    .connect(
        `mongodb+srv://Dragomir:${
            process.env.DATABASE_PASSWORD
        }@cluster0-lie0b.mongodb.net/shop?retryWrites=true&w=majority`
    )
    .then(() => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: "Drago",
                    email: "drago@drago.com",
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch(console.log);
