const mongodb = require("mongodb");
const { getDb } = require("../utils/database");
class Product {
    constructor(title, price, description, imageUrl, userId, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }
    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection("products").updateOne(
                { _id: this._id },
                {
                    $set: this
                }
            );
        } else {
            dbOp = db.collection("products").insertOne(this);
        }
        return dbOp.then(product => product).catch(console.log);
    }
    static fetchAll() {
        const db = getDb();
        return db
            .collection("products")
            .find()
            .toArray()
            .then(res => res)
            .catch(console.log);
    }
    static findById(prodId) {
        const db = getDb();
        return db
            .collection("products")
            .find({
                _id: new mongodb.ObjectId(prodId)
            })
            .next()
            .then(product => product)
            .catch(console.log);
    }

    static deleteById(prodId) {
        const db = getDb();
        return db
            .collection("products")
            .deleteOne({
                _id: new mongodb.ObjectId(prodId)
            })
            .then(product => product)
            .catch(console.log);
    }
}

module.exports = Product;
