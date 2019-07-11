const mongodb = require("mongodb");
const { getDb } = require("../utils/database");

const ObjectId = mongodb.ObjectId;
class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }
    save() {
        const db = getDb();
        return db
            .collection("users")
            .insertOne(this)
            .then(user => user)
            .catch(console.log);
    }
    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const newCartItems = [...this.cart.items];
        if (cartProductIndex !== -1) {
            newQuantity = newCartItems[cartProductIndex].quantity + 1;
            newCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            newCartItems.push({
                productId: new ObjectId(product._id),
                quantity: 1
            });
        }

        const db = getDb();
        return db
            .collection("users")
            .updateOne(
                { _id: new ObjectId(this._id) },
                {
                    $set: {
                        cart: {
                            items: newCartItems
                        }
                    }
                }
            )
            .then(user => user)
            .catch(console.log);
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(prod => prod.productId);
        return db
            .collection("products")
            .find({ _id: { $in: [...productIds] } })
            .toArray()
            .then(products =>
                products.map(p => ({
                    ...p,
                    quantity: this.cart.items.find(
                        i => i.productId.toString() === p._id.toString()
                    ).quantity
                }))
            )
            .catch(console.log);
    }
    static findById(userId) {
        const db = getDb();
        return db
            .collection("users")
            .findOne({ _id: new ObjectId(userId) })
            .then(user => user)
            .catch(console.log);
    }
}

module.exports = User;
