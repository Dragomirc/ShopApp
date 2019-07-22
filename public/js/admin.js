const deleteProduct = btn => {
    const prodId = btn.parentNode.querySelector("[name=id]").value;
    const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;
    const productElement = btn.closest("article");
    fetch(`/admin/product/${prodId}`, {
        method: "DELETE",
        headers: {
            "csrf-token": csrfToken
        }
    })
        .then(result => result.json())
        .then(data => {
            productElement.parentNode.removeChild(productElement);
        })
        .catch(console.log);
};
