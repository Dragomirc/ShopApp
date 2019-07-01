const path = require("path");
const Product = require("../models/product");
const Cart = require("../models/cart");
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
    Cart.fetchAll(cartItems => {
        res.render(path.join("shop", "cart"), {
            pageTitle: "Cart",
            path: "/cart",
            cartItems
        });
    });
};

exports.postAddToCart = (req, res) => {
    const { id } = req.params;
    Product.fetchProduct(products => {
        const { title, imageUrl, price } = products[id];
        const cart = new Cart(title, imageUrl, price);
        cart.addToCard();
        res.redirect("/products");
    });
};
exports.deleteCartItem = (req, res) => {
    const { id } = req.params;
    Cart.delete(id);
    res.redirect("/cart");
};
exports.getOrders = (req, res) => {
    res.render(path.join("shop", "orders"), {
        pageTitle: "Orders",
        path: "/orders"
    });
};
