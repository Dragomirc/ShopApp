const express = require("express");
const path = require("path");
const adminData = require("./routes/admin");
const shopHandlers = require("./routes/shop");
const app = express();

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminData.routes);
app.use(shopHandlers);

app.use("/", (req, res) => {
    res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000);
