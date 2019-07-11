require("dotenv").config();
const express = require("express");
const path = require("path");
const adminHandlers = require("./routes/admin");
const shopHandlers = require("./routes/shop");
const errorController = require("./controllers/errors");
const { mongoConnect } = require("./utils/database");
const User = require("./models/user");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
	if (!req.user) {
		User.findById("5d272d939d9ffb48b811db76").then(user => {
			const { name, email, cart, orders, _id } = user;
			req.user = new User(name, email, cart, orders, _id);

			next();
		});
	} else {
		next();
	}
});
app.use("/admin", adminHandlers.router);
app.use(shopHandlers);

app.use(errorController.get404);

mongoConnect(() => {
	app.listen(3000);
});
