const path = require("path");
const Product = require("../models/product");
const Cart = require("../models/cart");
exports.getProducts = (req, res) => {
    Product.findAll()
        .then(prods => {
            res.render(path.join("shop", "product-list"), {
                pageTitle: "Products",
                path: "/products",
                prods
            });
        })
        .catch(console.log);
};
exports.getProductDetails = (req, res) => {
    const { id } = req.params;
    Product.findByPk(id).then(product => {
        res.render(path.join("shop", "product-details"), {
            pageTitle: "Product Details",
            product,
            path: "/products"
        });
    });
};
exports.getIndex = (req, res) => {
    Product.findAll()
        .then(prods => {
            res.render(path.join("shop", "index"), {
                pageTitle: "Shop",
                path: "/",
                prods
            });
        })
        .catch(console.log);
};

exports.getCart = (req, res) => {
    req.user
        .getCart()
        .then(cart => cart.getProducts())
        .then(products => {
            res.render(path.join("shop", "cart"), {
                pageTitle: "Cart",
                path: "/cart",
                products
            });
        });
};

exports.postAddToCart = (req, res) => {
    const { productId } = req.body;
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({
                where: {
                    id: productId
                }
            });
        })
        .then(products => {
            let product;
            if (products.length) {
                product = products[0];
            }

            if (product) {
                const oldQuantity = product["cart-item"].qty;
                newQuantity = oldQuantity + 1;

                return product;
            }
            return Product.findByPk(productId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { qty: newQuantity }
            });
        })
        .then(() => {
            res.redirect("/cart");
        })
        .catch(console.log);
};
exports.deleteCartItem = (req, res) => {
    const { productId } = req.body;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            const product = products[0];
            return product["cart-item"].destroy();
        })
        .then(result => {
            res.redirect("/cart");
        })
        .catch(console.log);
};
exports.getOrders = (req, res) => {
    req.user
        .getOrders()
        // .then(orders => orders[0].getProducts())
        .then(orders => {
            res.render(path.join("shop", "orders"), {
                pageTitle: "Orders",
                path: "/orders",
                orders
            });
        });
};
exports.postOrder = (req, res) => {
    let fetchedCart;
    let fetchedProducts;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            fetchedProducts = products;
            return req.user.createOrder();
        })
        .then(order => {
            return order.addProducts(
                fetchedProducts.map(product => {
                    product["order-item"] = { qty: product["cart-item"].qty };
                    return product;
                })
            );
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch(console.log);
};
