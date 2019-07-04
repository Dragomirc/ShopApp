const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid/v4");
const Product = require("./product");
const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "cart.json"
);

const getCartItemsFromFile = cb => {
    let cartItems = { products: [], totalPrice: 0 };
    fs.readFile(p, (err, fileContent) => {
        if (!err && fileContent.length) {
            cb(JSON.parse(fileContent));
        } else {
            cb(cartItems);
        }
    });
};
module.exports = class Cart {
    static addToCard(productId, productPrice) {
        getCartItemsFromFile(cart => {
            const existingProductIndex = cart.products.findIndex(
                product => product.id === productId
            );
            const existingProduct = { ...cart.products[existingProductIndex] };
            let updatedProduct;
            if (existingProductIndex !== -1) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products.splice(existingProductIndex, 1, updatedProduct);
            } else {
                updatedProduct = { id: productId, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice += Number(productPrice);
            fs.writeFile(p, JSON.stringify(cart), err => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }
    static fetchAll(cb) {
        getCartItemsFromFile(cb);
    }
    static delete(productId, productPrice) {
        getCartItemsFromFile(cart => {
            const updatedCart = { ...cart };
            const product = cart.products.find(
                product => product.id === productId
            );
            if (product) {
                const productQty = product.qty;
                updatedCart.products = updatedCart.products.filter(
                    prod => prod.id !== productId
                );
                updatedCart.totalPrice =
                    updatedCart.totalPrice - productPrice * productQty;

                fs.writeFile(p, JSON.stringify(updatedCart), err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }
};
