const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid/v4");

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
        this.id = uuidv4();
        getCartItemsFromFile(cartItems => {
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
            const itemIndex = cartItems.findIndex(item => item.id === id);
            cartItems.splice(itemIndex, 1);
            fs.writeFile(p, JSON.stringify(cartItems), err => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }
};
