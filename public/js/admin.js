const deleteProduct = (btn) => {
  const prodIdElem = btn.parentNode.querySelector('input[name="productId"]');
  const prodId = prodIdElem.value;
  const csrfElem = btn.parentNode.querySelector('input[name="_csrf"]');
  const csrf = csrfElem.value;
  const productElemArticle = btn.closest("article");
  console.log("Product ID is -> " + prodIdElem.value);
  console.log("CSRF value -> " + csrf);

  fetch("/admin/product/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      console.log(result);
      return result.json();
    })
    .then((data) => {
      console.log(data);
      productElemArticle.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};
