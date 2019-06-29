const express = require("express");
const path = require("path");
const expressHbs = require("express-handlebars");
const adminData = require("./routes/admin");
const shopHandlers = require("./routes/shop");
const app = express();

app.engine(
    "hbs",
    expressHbs({
        layoutsDir: "views/layouts/",
        defaultLayout: "main-layout",
        extname: "hbs"
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminData.routes);
app.use(shopHandlers);

app.use("/", (req, res) => {
    res.status(404).render("404", {
        pageTitle: "Page Not Found"
    });
});

app.listen(3000);
