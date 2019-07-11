const mongodb = require("mongodb");
const { getDb } = require("../utils/database");

const ObjectId = mongodb.ObjectId;
class User {
	constructor(name, email, cart, orders, _id) {
		this.name = name;
		this.email = email;
		this.cart = cart;
		this.orders = orders;
		this._id = _id ? new mongodb.ObjectId(_id) : null;
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
				productId: new ObjectId(product._id.toString()),
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
	deleteCartItemById(prodId) {
		const updatedCartItems = this.cart.items.filter(
			cp => cp.productId.toString() !== prodId.toString()
		);

		const db = getDb();
		return db
			.collection("users")
			.updateOne(
				{ _id: new ObjectId(this._id) },
				{
					$set: {
						cart: {
							items: updatedCartItems
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
	addOrder() {
		const db = getDb();
		return this.getCart()
			.then(products => {
				const order = {
					items: products,
					user: {
						_id: new ObjectId(this._id),
						name: this.name
					}
				};

				return db.collection("orders").insertOne(order);
			})
			.then(() => {
				this.cart = { items: [] };
				return db.collection("users").updateOne(
					{ _id: new ObjectId(this.id) },
					{
						$set: { cart: this.cart }
					}
				);
			})
			.catch(console.log);
	}
	getOrders() {
		const db = getDb();
		return db.collection("orders");
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
