const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid/v4");
const Cart = require("./cart");
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
    constructor(title, imageUrl, description, price, id) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.id = id;
    }

    save() {
        getProductsFromFile(products => {
            const updatedProducts = [...products];
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    prod => prod.id === this.id
                );
                updatedProducts[existingProductIndex] = this;
            } else {
                this.id = uuidv4();
                updatedProducts.push(this);
            }
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    static delete(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const newProducts = products.filter(product => product.id !== id);
            fs.writeFile(p, JSON.stringify(newProducts), err => {
                Cart.delete(id, product.price);
                if (err) {
                    console.log(err);
                }
            });
        });
    }
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(product => product.id === id);
            cb(product);
        });
    }
};
