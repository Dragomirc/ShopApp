const path = require("path");
const { validationResult } = require("express-validator");
const { deleteFile } = require("../utils/file");
const Product = require("../models/product");

const ITEMS_PER_PAGE = 2;
exports.getProducts = (req, res, next) => {
    let page = +req.query.page || 1;
    if (!page) {
        page = 1;
    }
    let totalItems = 0;
    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return (
                Product.find({ userId: req.user._id })
                    .skip((page - 1) * ITEMS_PER_PAGE)
                    .limit(ITEMS_PER_PAGE)
                    // .select("title price -_id")
                    // .populate("userId", "name")
                    .then(prods => {
                        res.render(path.join("admin", "products"), {
                            prods,
                            path: "/admin/products",
                            pageTitle: "Admin Products",
                            totalProducts: totalItems,
                            queryPage: page,
                            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                            hasPreviousPage: page > 1,
                            nextPage: page + 1,
                            previousPage: page - 1,
                            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                            currentPage: page,
                            csrfToken: req.csrfToken()
                        });
                    })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                    })
            );
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
    const { title, description, price, id, imageUrl } = req.body;
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
                const oldImagePath = product.imageUrl;
                product.imageUrl = image.path;
                deleteFile(oldImagePath);
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
    Product.findById(id)
        .then(product => {
            if (!product) {
                return next(new Error("Product not found."));
            }
            const imagePath = product.imageUrl;
            deleteFile(imagePath);
            return Product.deleteOne({ _id: id, userId: req.user._id });
        })
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
