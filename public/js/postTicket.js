const addToCartButtons = document.querySelectorAll('.addTicket');

addToCartButtons.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
    
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
        console.log(data);
        window.location.href = '/compra';
      })
      .catch(error => {
        console.error(error);
      });
  });
});