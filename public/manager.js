const form = document.getElementById("productForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const titulo = form.elements.titulo.value;
  const precio = form.elements.precio.value;
  const descripcion = form.elements.descripcion.value;
  const code = form.elements.code.value;
  const stock = form.elements.stock.value;
  const thumbnail = form.elements.thumbnail.value;
  const owner = form.elements.owner.value;

  // Crear un objeto con los datos del formulario
  const data = { titulo, precio, descripcion, code, stock, thumbnail, owner };

  // Enviar una solicitud POST a la ruta especificada
  fetch(`/api/cart//owner/${owner}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});