const path = require("path");
const uuidv4 = require("uuid/v4");
const Product = require("../models/product");
exports.getProducts = (req, res) => {
    Product.fetchAll().then(products => {
        res.render(path.join("admin", "products"), {
            prods: products[0],
            path: "/admin/products",
            pageTitle: "Admin Products"
        });
    });
};
exports.getAddProduct = (req, res) => {
    res.render(path.join("admin", "edit-product"), {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false
    });
};
exports.postAddProduct = (req, res) => {
    const { title, imageUrl, description, price } = req.body;
    const product = new Product(title, imageUrl, description, price);
    product
        .save()
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};

exports.getEditProduct = (req, res) => {
    const { id } = req.params;
    Product.findById(id).then(product =>
        res.render(path.join("admin", "edit-product"), {
            path: "/admin/edit-prooduct",
            pageTitle: "Edit Product",
            product: product[0][0],
            editing: true
        })
    );
};
exports.postEditProduct = (req, res) => {
    const { title, imageUrl, description, price, id } = req.body;
    const newProduct = new Product(title, imageUrl, description, price, id);
    newProduct
        .save()
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};

exports.deleteProduct = (req, res) => {
    const { id } = req.body;
    Product.delete(id)
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};
