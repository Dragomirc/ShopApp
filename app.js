require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const adminHandlers = require("./routes/admin");
const shopHandlers = require("./routes/shop");
const errorController = require("./controllers/errors");
const authHandlers = require("./routes/auth");
const User = require("./models/user");

const MONGODB_URI = `mongodb+srv://Dragomir:${
    process.env.DATABASE_PASSWORD
}@cluster0-lie0b.mongodb.net/shop?retryWrites=true&w=majority`;
const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions"
});
const csrFProtection = csrf();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
        store
    })
);
app.use(csrFProtection);
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(console.log);
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use(authHandlers);
app.use("/admin", adminHandlers.router);
app.use(shopHandlers);
app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(3000);
    })
    .catch(console.log);
