const db = require("../utils/database");
const uuidv4 = require("uuid/v4");
const Product = require("./product");

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
    static fetchAll() {
        return db.execute("SELECT * FROM cart");
        return db.execute(
            "SELECT products.id, products.description, products.title, products.price, products.imageUrl, cart.qty FROM products INNER JOIN cart ON products.id=cart.productId"
        );
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
