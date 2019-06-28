const express = require("express");
const path = require("path");
const adminHandlers = require("./routes/admin");
const shopHandlers = require("./routes/shop");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminHandlers);
app.use(shopHandlers);

app.use("/", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
