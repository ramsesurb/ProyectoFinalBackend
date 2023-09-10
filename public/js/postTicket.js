const addToCartButtons = document.querySelectorAll('.addTicket');

addToCartButtons.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();

    const productId = e.target.dataset.id;
    const cartId = e.target.dataset.cartId;;

    fetch(`/api/cart/${cartId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      .then(response => response.json())
      .then(data => {
        // Aquí puedes manejar la respuesta del servidor después de agregar el producto al carrito
        console.log(data);
      
        // Redirigir a la página "/prods" después de que se complete la compra
        window.location.href = '/prods';
      })
      .catch(error => {
        console.error(error);
      });
  });
});