const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 2;
exports.getProducts = (req, res, next) => {
    let page = Number(req.query.page);
    if (!page) {
        page = 1;
    }
    let totalItems = 0;
    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(prods => {
                    res.render(path.join("shop", "product-list"), {
                        pageTitle: "Products",
                        path: "/products",
                        prods,
                        totalProducts: totalItems,
                        queryPage: page,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        currentPage: page,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                        csrfToken: req.csrfToken()
                    });
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
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
    let page = Number(req.query.page);
    if (!page) {
        page = 1;
    }
    let totalItems = 0;
    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(prods => {
                    res.render(path.join("shop", "index"), {
                        pageTitle: "Shop",
                        path: "/",
                        prods,
                        totalProducts: totalItems,
                        queryPage: page,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        currentPage: page,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                        csrfToken: req.csrfToken()
                    });
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
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

exports.getCheckout = (req, res, next) => {
    const { user } = req;
    user.populate("cart.items.productId")
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            let totalSum = 0;
            products.forEach(product => {
                totalSum += product.quantity * product.productId.price;
            });
            res.render(path.join("shop", "checkout"), {
                pageTitle: "Checkout",
                path: "/checkout",
                products,
                totalSum
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
    let total = 0;
    user.populate("cart.items.productId")
        .execPopulate()
        .then(({ cart }) => {
            const newUser = {
                email: user.email,
                userId: user
            };

            const products = cart.items.map(product => {
                total += product.quantity * product.productId.price;
                return {
                    product: { ...product.productId._doc },
                    quantity: product.quantity
                };
            });

            const order = new Order({ user: newUser, products });
            return order.save();
        })
        .then(result => {
            const stripe = require("stripe")(
                "sk_test_teg388lmFPh8UR8Tz1zyV3UD00qI8ZcLjW"
            );
            const charge = stripe.charges.create({
                amount: total,
                currency: "usd",
                source: "tok_visa",
                receipt_email: user.email,
                metadata: { order_id: SpeechRecognitionResult._id }
            });
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
exports.getInvoice = (req, res, next) => {
    const { orderId } = req.params;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error("No order found."));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error("Unauthorized!"));
            }
            const invoiceName = `invoice-${orderId}.pdf`;
            const invoicePath = path.join("data", "invoices", invoiceName);
            const pdfDoc = new PDFDocument();
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `inline; filename="${invoiceName}"`
            );
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.fontSize(26).text("Invoice", { underline: true });

            pdfDoc.text("-----------------------------------");
            let totalPrice = 0;

            order.products.forEach(i => {
                const { quantity } = i;
                const { title, price } = i.product;
                pdfDoc.fontSize(14).text(`${title} - ${quantity} x $${price}`);
                totalPrice += quantity * price;
            });
            pdfDoc.text("--------------");
            pdfDoc.fontSize(20).text(`Total price: $${totalPrice}`);
            pdfDoc.end();
            // const file = fs.createReadStream(invoicePath);
            // res.setHeader("Content-Type", "application/pdf");
            // res.setHeader(
            //     "Content-Disposition",
            //     `attachment; filename="${invoiceName}"`
            // );
            // file.pipe(res);
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
