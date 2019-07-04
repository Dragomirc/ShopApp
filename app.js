require("dotenv").config();
const express = require("express");
const path = require("path");
const adminHandlers = require("./routes/admin");
const shopHandlers = require("./routes/shop");
const errorController = require("./controllers/errors");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminHandlers.router);
app.use(shopHandlers);

app.use(errorController.get404);

app.listen(3000);
