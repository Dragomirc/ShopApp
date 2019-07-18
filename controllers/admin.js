const path = require("path");
const { validationResult } = require("express-validator");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        // .select("title price -_id")
        // .populate("userId", "name")
        .then(prods => {
            res.render(path.join("admin", "products"), {
                prods,
                path: "/admin/products",
                pageTitle: "Admin Products"
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
exports.getAddProduct = (req, res) => {
    res.render(path.join("admin", "edit-product"), {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};
exports.postAddProduct = (req, res, next) => {
    const { title, description, price } = req.body;
    const image = req.file;
    if (!image) {
        return res.status(422).render(path.join("admin", "edit-product"), {
            pageTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            errorMessage:
                "The attached image should be in either png or jpg format.",
            hasError: true,
            validationErrors: [],
            product: {
                title,
                description,
                price
            }
        });
    }
    const userId = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render(path.join("admin", "edit-product"), {
            pageTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            product: {
                title,
                description,
                price
            }
        });
    }
    const imageUrl = image.path;
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
        .catch(err => {
            const error = new Error(err);

            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditProduct = (req, res, next) => {
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
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
exports.postEditProduct = (req, res, next) => {
    const { title, description, price, id } = req.body;
    const image = req.file;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render(path.join("admin", "edit-product"), {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: true,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            product: {
                title,
                description,
                price,
                _id: id
            }
        });
    }
    Product.findById(id)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect("/");
            }
            product.title = title;
            if (image) {
                product.imageUrl = image.path;
            }
            product.description = description;
            product.price = price;
            return product.save().then(prod => {
                res.redirect("/admin/products");
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.deleteProduct = (req, res, next) => {
    const { id } = req.body;
    Product.deleteOne({ _id: id, userId: req.user._id })
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
