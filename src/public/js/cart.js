const addToCartButtons = document.querySelectorAll(".addCart");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const productId = e.target.dataset.id;
    const cartId = e.target.dataset.cartId;

    fetch(`/api/cart/${cartId}/product/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
