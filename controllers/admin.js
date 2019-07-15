const path = require("path");
const Product = require("../models/product");

exports.getProducts = (req, res) => {
    const { isLoggedIn } = req.session;
    Product.find()
        // .select("title price -_id")
        // .populate("userId", "name")
        .then(prods => {
            res.render(path.join("admin", "products"), {
                prods,
                path: "/admin/products",
                pageTitle: "Admin Products",
                isAuthenticated: isLoggedIn
            });
        });
};
exports.getAddProduct = (req, res) => {
    const { isLoggedIn } = req.session;
    res.render(path.join("admin", "edit-product"), {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        isAuthenticated: isLoggedIn
    });
};
exports.postAddProduct = (req, res) => {
    const { title, imageUrl, description, price } = req.body;
    const userId = req.user;
    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId
    });
    product
        .save()
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};

exports.getEditProduct = (req, res) => {
    const { isLoggedIn } = req.session;
    const { id } = req.params;
    Product.findById(id)
        .then(product => {
            res.render(path.join("admin", "edit-product"), {
                path: "/admin/edit-prooduct",
                pageTitle: "Edit Product",
                product,
                editing: true,
                isAuthenticated: isLoggedIn
            });
        })
        .catch(console.log);
};
exports.postEditProduct = (req, res) => {
    const { title, imageUrl, description, price, id } = req.body;
    Product.findById(id)
        .then(product => {
            product.title = title;
            product.imageUrl = imageUrl;
            product.description = description;
            product.price = price;
            return product.save();
        })
        .then(prod => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};

exports.deleteProduct = (req, res) => {
    const { id } = req.body;
    Product.findByIdAndRemove(id)
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(console.log);
};
