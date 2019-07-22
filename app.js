require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const isAuth = require("./middleware/is-auth");
const shopController = require("./controllers/shop");
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
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
    destination: (req, file, cb) => {
        cb(null, "images");
    }
});
const fileFilter = (req, file, cb) => {
    const { mimetype } = file;
    if (
        mimetype === "image/png" ||
        mimetype === "image/jpeg" ||
        mimetype === "image/jpeg"
    ) {
        cb(null, true);
    }
    cb(null, false);
};
app.set("view engine", "ejs");
app.set("views", "views");
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
        store
    })
);

app.use(flash());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            err.httpStatusCode = 500;
            return next(err);
        });
});

app.post("/create-order", isAuth, shopController.postOrder);
app.use(csrfProtection);
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(authHandlers);
app.use("/admin", adminHandlers.router);
app.use(shopHandlers);
app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.httpStatusCode).render("500", {
        pageTitle: "Error",
        path: "/500",
        isAuthenticated: req.session.isLoggedIn
    });
});
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(3000);
    })
    .catch(console.log);
