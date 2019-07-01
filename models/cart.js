const fs = require("fs");
const path = require("path");

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "cart.json"
);

const getCartItemsFromFile = cb => {
    let cartItems = [];
    fs.readFile(p, (err, data) => {
        if (!err && data.length) {
            cb(JSON.parse(data));
        } else {
            cb(cartItems);
        }
    });
};
module.exports = class Cart {
    constructor(title, imageUrl, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
    }

    addToCard() {
        getCartItemsFromFile(cartItems => {
            this.id = cartItems.length || 0;
            cartItems.push(this);
            fs.writeFile(p, JSON.stringify(cartItems), err => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }
    static fetchAll(cb) {
        getCartItemsFromFile(cb);
    }
    static delete(id) {
        getCartItemsFromFile(cartItems => {
            cartItems.splice(id, 1);
            fs.writeFile(p, JSON.stringify(cartItems), err => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }
};
