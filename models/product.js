const fs = require("fs");
const path = require("path");

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "products.json"
);

const getProductsFromFile = cb => {
    let products = [];
    fs.readFile(p, (err, data) => {
        if (!err && data.length) {
            cb(JSON.parse(data));
        } else {
            cb(products);
        }
    });
};
module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
};
