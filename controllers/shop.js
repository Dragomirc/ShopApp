const path = require("path");
const Product = require("../models/product");

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render(path.join("shop", "product-list"), {
            pageTitle: "Products",
            prods: products,
            path: "/products"
        });
    });
};

exports.getIndex = (req, res) => {
    res.render(path.join("shop", "index"), {
        pageTitle: "Shop",
        path: "/"
    });
};

exports.getCart = (req, res) => {
    res.render(path.join("shop", "cart"), {
        pageTitle: "Cart",
        path: "/cart"
    });
};
exports.getOrders = (req, res) => {
    res.render(path.join("shop", "orders"), {
        pageTitle: "Orders",
        path: "/orders"
    });
};
