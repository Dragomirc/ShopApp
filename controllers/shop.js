const path = require("path");
const Product = require("../models/product");
const Cart = require("../models/cart");
exports.getProducts = (req, res) => {
    Product.fetchAll()
        .then(products => {
            res.render(path.join("shop", "product-list"), {
                pageTitle: "Products",
                path: "/products",
                prods: products[0]
            });
        })
        .catch(console.log);
};
exports.getProductDetails = (req, res) => {
    const { id } = req.params;
    Product.findById(id).then(product => {
        res.render(path.join("shop", "product-details"), {
            pageTitle: "Product Details",
            product: product[0][0],
            path: "/products"
        });
    });
};
exports.getIndex = (req, res) => {
    Product.fetchAll()
        .then(products => {
            res.render(path.join("shop", "index"), {
                pageTitle: "Shop",
                path: "/",
                prods: products[0]
            });
        })
        .catch(console.log);
};

exports.getCart = (req, res) => {
    Cart.fetchAll().then(cart => {
        res.render(path.join("shop", "cart"), {
            pageTitle: "Cart",
            path: "/cart",
            cartProducts: cart[0]
        });
    });
};

exports.postAddToCart = (req, res) => {
    const { productId, productPrice } = req.body;
    Cart.addToCard(productId, productPrice)
        .then(() => {
            res.redirect("/cart");
        })
        .catch(console.log);
};
exports.deleteCartItem = (req, res) => {
    const { productId } = req.body;
    Cart.delete(productId)
        .then(() => {
            res.redirect("/cart");
        })
        .catch(console.log);
};
exports.getOrders = (req, res) => {
    res.render(path.join("shop", "orders"), {
        pageTitle: "Orders",
        path: "/orders"
    });
};
