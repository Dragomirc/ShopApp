const db = require("../utils/database");
const Cart = require("./cart");

module.exports = class Product {
    constructor(title, imageUrl, description, price, id) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.id = id;
    }

    save() {
        if (this.id) {
            const { title, imageUrl, description, price } = this;
            return db.execute(
                `UPDATE products SET title = '${title}', imageUrl = '${imageUrl}', description = '${description}' WHERE id = ${
                    this.id
                }`
            );
        } else {
            const { title, imageUrl, description, price } = this;
            return db.execute(
                `INSERT INTO products (title, price, description, imageUrl) VALUES('${title}', '${price}','${description}','${imageUrl}')`
            );
        }
    }

    static delete(id) {
        return db.execute(`DELETE FROM products WHERE id=${id}`);
    }
    static fetchAll() {
        return db.execute("SELECT * FROM products");
    }
    static findById(id) {
        return db.execute(`SELECT * FROM products WHERE id=${id}`);
    }
};
