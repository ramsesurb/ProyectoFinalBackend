const premiumButton = document.querySelectorAll('.premiumButton');

premiumButton.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();

    const productId = e.target.dataset.id;
    const cartId = e.target.dataset.cartId;

    fetch(`/users/${cartId}/upgradeToPremium`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
      
        console.log(data);
      
        console.log('Función then ejecutada con éxito');
      
        window.location.href = '/users';
      })
    .catch(error => {
      console.error(error);
    });
  });
});

const userButton = document.querySelectorAll('.userButton');

userButton.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();

    const productId = e.target.dataset.id;
    const cartId = e.target.dataset.cartId;

    fetch(`/users/${cartId}/returnToUser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
      
        console.log(data);
      
        console.log('Función then ejecutada con éxito');
      
        window.location.href = '/users';
      })
    .catch(error => {
      console.error(error);
    });
  });
});

const deleteButton = document.querySelectorAll('.deleteButton');

deleteButton.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();

    const productId = e.target.dataset.id;
    const cartId = e.target.dataset.cartId;

    fetch(`/users/${cartId}/deleteUser`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
      
        console.log(data);
      
        console.log('Función then ejecutada con éxito');
      
        window.location.href = '/users';
      })
    .catch(error => {
      console.error(error);
    });
  });
});