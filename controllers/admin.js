const path = require("path");
const Product = require("../models/product");
exports.getProducts = (req, res) => {
    Product.findAll().then(prods => {
        res.render(path.join("admin", "products"), {
            prods,
            path: "/admin/products",
            pageTitle: "Admin Products"
        });
    });
};
exports.getAddProduct = (req, res) => {
    res.render(path.join("admin", "edit-product"), {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false
    });
};
exports.postAddProduct = (req, res) => {
    const { title, imageUrl, description, price } = req.body;
    req.user
        .createProduct({ title, imageUrl, description, price })
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};

exports.getEditProduct = (req, res) => {
    const { id } = req.params;
    req.user
        .getProducts({
            where: {
                id
            }
        })
        .then(product => {
            res.render(path.join("admin", "edit-product"), {
                path: "/admin/edit-prooduct",
                pageTitle: "Edit Product",
                product: product[0],
                editing: true
            });
        });
};
exports.postEditProduct = (req, res) => {
    const { title, imageUrl, description, price, id } = req.body;
    req.user
        .getEditProduct(
            { title, imageUrl, description, price },
            {
                where: {
                    id
                }
            }
        )
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};

exports.deleteProduct = (req, res) => {
    const { id } = req.body;
    Product.destroy({
        where: {
            id
        }
    })
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};
