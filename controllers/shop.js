const path = require("path");
const Product = require("../models/product");
const User = require("../models/user");

exports.getProducts = (req, res) => {
    Product.fetchAll()
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
    Product.findById(id)
        .then(product => {
            res.render(path.join("shop", "product-details"), {
                pageTitle: "Product Details",
                product,
                path: "/products"
            });
        })
        .catch(console.log);
};
exports.getIndex = (req, res) => {
    Product.fetchAll()
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
    const { user } = req;
    user.getCart()
        .then(products => {
            res.render(path.join("shop", "cart"), {
                pageTitle: "Shop",
                path: "/cart",
                products
            });
        })
        .catch(console.log);
};

exports.postAddToCart = (req, res) => {
    const { productId } = req.body;
    const user = req.user;
    return Product.findById(productId)
        .then(product => user.addToCart(product))
        .then(() => {
            res.redirect("/cart");
        })
        .catch(console.log);
};
// exports.deleteCartItem = (req, res) => {
//     const { productId } = req.body;
//     req.user
//         .getCart()
//         .then(cart => {
//             return cart.getProducts({ where: { id: productId } });
//         })
//         .then(products => {
//             const product = products[0];
//             return product["cart-item"].destroy();
//         })
//         .then(result => {
//             res.redirect("/cart");
//         })
//         .catch(console.log);
// };
// exports.getOrders = (req, res) => {
//     req.user.getOrders({ include: ["products"] }).then(orders => {
//         res.render(path.join("shop", "orders"), {
//             pageTitle: "Orders",
//             path: "/orders",
//             orders
//         });
//     });
// };
// exports.postOrder = (req, res) => {
//     let fetchedCart;
//     let fetchedProducts;
//     req.user
//         .getCart()
//         .then(cart => {
//             fetchedCart = cart;
//             return cart.getProducts();
//         })
//         .then(products => {
//             fetchedProducts = products;
//             return req.user.createOrder();
//         })
//         .then(order => {
//             return order.addProducts(
//                 fetchedProducts.map(product => {
//                     product["order-item"] = { qty: product["cart-item"].qty };
//                     return product;
//                 })
//             );
//         })
//         .then(result => {
//             return fetchedCart.setProducts(null);
//         })
//         .then(() => {
//             res.redirect("/orders");
//         })
//         .catch(console.log);
// };
