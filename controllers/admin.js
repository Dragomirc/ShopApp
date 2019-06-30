const path = require("path");
const Product = require("../models/product");
exports.getAddProduct = (req, res) => {
    res.render(path.join("admin", "add-product"), {
        pageTitle: "Add Product",
        path: "/admin/add-product"
    });
};

exports.getProducts = (req, res) => {
    res.render(path.join("admin", "products"), {
        path: "/admin/products",
        pageTitle: "Admin Products"
    });
};
exports.getEditProduct = (req, res) => {
    res.render(path.join("admin", "edit-product"), {
        path: "/admin/edit-prooduct",
        pageTitle: "Edit Product"
    });
};
exports.postEditProduct = (req, res) => {
    res.redirect("/admin/products");
};
exports.postAddProduct = (req, res) => {
    const { title, imageUrl, description, price } = req.body;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect("/");
};
