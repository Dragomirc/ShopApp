const path = require("path");
const Product = require("../models/product");
exports.getProducts = (req, res) => {
    Product.fetchAll().then(prods => {
        res.render(path.join("admin", "products"), {
            prods,
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
    const userId = req.user._id;
    const product = new Product(title, price, description, imageUrl, userId);
    product
        .save()
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};

exports.getEditProduct = (req, res) => {
    const { id } = req.params;
    Product.findById(id)
        .then(product => {
            res.render(path.join("admin", "edit-product"), {
                path: "/admin/edit-prooduct",
                pageTitle: "Edit Product",
                product,
                editing: true
            });
        })
        .catch(console.log);
};
exports.postEditProduct = (req, res) => {
    const { title, imageUrl, description, price, id } = req.body;
    const userId = req.user._id;
    const product = new Product(
        title,
        price,
        description,
        imageUrl,
        userId,
        id
    );
    product
        .save()
        .then(prod => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};

exports.deleteProduct = (req, res) => {
    const { id } = req.body;

    Product.deleteById(id)
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};
