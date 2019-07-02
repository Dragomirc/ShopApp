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
exports.getProductDetails = (req, res) => {
    const { id } = req.params;
    Product.findById(id, product => {
        res.render(path.join("shop", "product-details"), {
            pageTitle: "Product Details",
            product,
            path: "/product"
        });
    });
};
exports.getIndex = (req, res) => {
    Product.fetchAll(products => {
        res.render(path.join("shop", "index"), {
            pageTitle: "Shop",
            path: "/",
            prods: products
        });
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
    Product.findById(id, product => {
        const { title, imageUrl, price } = product;
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
