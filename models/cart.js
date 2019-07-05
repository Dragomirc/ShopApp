const db = require("../utils/database");

module.exports = class Cart {
    static addToCard(productId) {
        return db
            .execute(`SELECT * FROM cart WHERE productId = ${productId}`)
            .then(response => {
                if (response[0].length) {
                    const currentCartItem = response[0][0];
                    return db.execute(
                        `UPDATE cart SET qty = '${currentCartItem.qty +
                            1}'  WHERE productId = ${productId}`
                    );
                } else {
                    return db.execute(
                        `INSERT INTO cart (productId, qty) VALUES ( '${productId}', '1')`
                    );
                }
            });
    }
    static fetchAll() {
        return db.execute(
            "SELECT products.id, products.description, products.title, products.price, products.imageUrl, cart.qty FROM cart INNER JOIN products ON products.id=cart.productId"
        );
    }
    static delete(productId) {
        return db.execute(`DELETE FROM cart WHERE productId = ${productId}`);
    }
};
