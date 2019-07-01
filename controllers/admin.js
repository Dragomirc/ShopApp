const path = require("path");
const Product = require("../models/product");
exports.getAddProduct = (req, res) => {
    res.render(path.join("admin", "add-product"), {
        pageTitle: "Add Product",
        path: "/admin/add-product"
    });
};

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render(path.join("admin", "products"), {
            prods: products,
            path: "/admin/products",
            pageTitle: "Admin Products"
        });
    });
};
exports.getEditProduct = (req, res) => {
    const { id } = req.params;
    Product.fetchProduct(products =>
        res.render(path.join("admin", "edit-product"), {
            path: "/admin/edit-prooduct",
            pageTitle: "Edit Product",
            product: products[id]
        })
    );
};
exports.postEditProduct = (req, res) => {
    const { id } = req.params;
    const { title, imageUrl, description, price } = req.body;
    const newProduct = new Product(title, imageUrl, description, price, id);
    newProduct.edit(id, newProduct);
    res.redirect("/admin/products");
};

exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    Product.delete(id);
    res.redirect("/admin/products");
};
exports.postAddProduct = (req, res) => {
    const { title, imageUrl, description, price } = req.body;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect("/admin/products");
};
