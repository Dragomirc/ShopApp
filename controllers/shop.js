const path = require("path");
const Product = require("../models/product");
const Order = require("../models/order");
exports.getProducts = (req, res) => {
    Product.find()
        .then(prods => {
            res.render(path.join("shop", "product-list"), {
                pageTitle: "Products",
                path: "/products",
                prods,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(console.log);
};
exports.getProductDetails = (req, res) => {
    const { id } = req.params;
    Product.findById(id)
        .then(product => {
            res.render(path.join("shop", "product-details"), {
                pageTitle: "Product Details",
                product,
                path: "/products",
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(console.log);
};
exports.getIndex = (req, res) => {
    // const isLoggedIn = req
    //     .get("Cookie")
    //     .split(";")[2]
    //     .trim()
    //     .split("=")[1];
    Product.find()
        .then(prods => {
            res.render(path.join("shop", "index"), {
                pageTitle: "Shop",
                path: "/",
                prods,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(console.log);
};

exports.getCart = (req, res) => {
    const { user } = req;
    user.populate("cart.items.productId")
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render(path.join("shop", "cart"), {
                pageTitle: "Shop",
                path: "/cart",
                products,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(console.log);
};

exports.postAddToCart = (req, res) => {
    const { productId } = req.body;
    const { user } = req;
    return Product.findById(productId)
        .then(product => user.addToCart(product))
        .then(() => {
            res.redirect("/cart");
        })
        .catch(console.log);
};
exports.deleteCartItem = (req, res) => {
    const { productId } = req.body;
    const { user } = req;
    user.deleteCartItem(productId)
        .then(() => {
            res.redirect("/cart");
        })
        .catch(console.log);
};
exports.getOrders = (req, res) => {
    const userId = req.session.user._id;
    Order.find({ "user.userId": userId }).then(orders => {
        res.render(path.join("shop", "orders"), {
            pageTitle: "Orders",
            path: "/orders",
            orders,
            isAuthenticated: req.session.isLoggedIn
        });
    });
};
exports.postOrder = (req, res) => {
    const { user } = req;
    user.populate("cart.items.productId")
        .execPopulate()
        .then(({ cart }) => {
            const newUser = {
                name: user.name,
                userId: user
            };
            const products = cart.items.map(product => {
                return {
                    product: { ...product.productId._doc },
                    quantity: product.quantity
                };
            });

            const order = new Order({ user: newUser, products });
            return order.save();
        })
        .then(() => {
            return user.clearCart();
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch(console.log);
};
