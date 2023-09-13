const socket = io();

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

  console.log(event);
  socket.emit("nuevoProducto", {
    titulo,
    precio,
    descripcion,
    code,
    stock,
    owner,
    thumbnail,
  });
});

const form2 = document.getElementById("productForm2");

form2.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = form2.elements.id.value;

  console.log(event);
  socket.emit("quitarProducto", { id });
});

socket.on("actualizarTabla", (data) => {
  renderizarTabla(data);
});

const renderizarTabla = (data) => {
  const tbody = document.getElementById("prodDisplay");

  const productsMap = data
    .map((item) => {
      return `<tr>
  <th scope="row">${item._id}</th>
  <td>${item.titulo}</td>
  <td>${item.precio}</td>
  <td>${item.stock}</td>
  <td>${item.owner.first_name} ${item.owner.last_name}</td>
  <td><img src="${item.thumbnail}" width="50"></td>
  </tr>
  `;
    })
    .join("");
  tbody.innerHTML = productsMap;
};
