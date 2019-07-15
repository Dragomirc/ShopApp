const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    orders: [
        {
            items: [
                {
                    productId: {
                        type: Schema.Types.ObjectId,
                        required: true,
                        ref: "Product"
                    },
                    quantity: {
                        type: Number,
                        required: true
                    }
                }
            ]
        }
    ]
});
userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
};

userSchema.methods.addToCart = function(product) {
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
            productId: product._id.toString(),
            quantity: newQuantity
        });
    }
    this.cart = { items: newCartItems };
    return this.save();
};

userSchema.methods.deleteCartItem = function(productId) {
    const updatedItems = this.cart.items.filter(cp => {
        return cp.productId.toString() !== productId.toString();
    });
    this.cart = { items: updatedItems };
    return this.save();
};

module.exports = mongoose.model("User", userSchema);
