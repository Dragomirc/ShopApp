const path = require("path");

const Product = require("../models/product");
const Order = require("../models/order");
exports.getProducts = (req, res, next) => {
    Product.find()
        .then(prods => {
            res.render(path.join("shop", "product-list"), {
                pageTitle: "Products",
                path: "/products",
                prods
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
exports.getProductDetails = (req, res, next) => {
    const { id } = req.params;
    Product.findById(id)
        .then(product => {
            res.render(path.join("shop", "product-details"), {
                pageTitle: "Product Details",
                product,
                path: "/products"
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
exports.getIndex = (req, res, next) => {
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
                csrfToken: req.csrfToken()
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCart = (req, res, next) => {
    const { user } = req;
    user.populate("cart.items.productId")
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render(path.join("shop", "cart"), {
                pageTitle: "Shop",
                path: "/cart",
                products
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postAddToCart = (req, res, next) => {
    const { productId } = req.body;
    const { user } = req;
    return Product.findById(productId)
        .then(product => user.addToCart(product))
        .then(() => {
            res.redirect("/cart");
        })

        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
exports.deleteCartItem = (req, res, next) => {
    const { productId } = req.body;
    const { user } = req;
    user.deleteCartItem(productId)
        .then(() => {
            res.redirect("/cart");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
exports.getOrders = (req, res, next) => {
    const userId = req.session.user._id;
    Order.find({ "user.userId": userId })
        .then(orders => {
            res.render(path.join("shop", "orders"), {
                pageTitle: "Orders",
                path: "/orders",
                orders
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
exports.postOrder = (req, res, next) => {
    const { user } = req;
    user.populate("cart.items.productId")
        .execPopulate()
        .then(({ cart }) => {
            const newUser = {
                email: user.email,
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

        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
