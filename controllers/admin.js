const path = require("path");
const Product = require("../models/product");
const { validationResult } = require("express-validator");

exports.getProducts = (req, res) => {
    Product.find({ userId: req.user._id })
        // .select("title price -_id")
        // .populate("userId", "name")
        .then(prods => {
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
        editing: false,
        errorMessage: null,
        validationErrors: []
    });
};
exports.postAddProduct = (req, res) => {
    const { title, imageUrl, description, price } = req.body;
    const userId = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render(path.join("admin", "edit-product"), {
            pageTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            product: {
                title,
                imageUrl,
                description,
                price
            }
        });
    }
    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId
    });
    product
        .save()
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};

exports.getEditProduct = (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.redirect("/admin/products");
    }
    Product.findById(id)
        .then(product => {
            res.render(path.join("admin", "edit-product"), {
                path: "/admin/edit-prooduct",
                pageTitle: "Edit Product",
                product,
                editing: true,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(console.log);
};
exports.postEditProduct = (req, res) => {
    const { title, imageUrl, description, price, id } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render(path.join("admin", "edit-product"), {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: false,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            product: {
                title,
                imageUrl,
                description,
                price
            }
        });
    }
    Product.findById(id)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect("/");
            }
            product.title = title;
            product.imageUrl = imageUrl;
            product.description = description;
            product.price = price;
            return product.save().then(prod => {
                res.redirect("/admin/products");
            });
        })

        .catch(console.log);
};

exports.deleteProduct = (req, res) => {
    const { id } = req.body;
    Product.deleteOne({ _id: id, userId: req.user._id })
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};
