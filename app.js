const express = require("express");
const adminHandlers = require("./routes/admin");
const shopHandlers = require("./routes/shop");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/admin", adminHandlers);
app.use(shopHandlers);

app.use("/", (req, res) => {
	res.status(404).send("<h1>Page Not Found</h1>");
});

app.listen(3000);
