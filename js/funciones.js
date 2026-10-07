const producutos = [
      {id :1, nombre: "Esencia Noa 01" , descripcion: "aroma fresco almizclado y amaderado", imagen: "perfume1.avif", precio: 29.90},
      {id :2, nombre: "Esencia Noa 02" , descripcion: "aroma fresco almizclado y amaderado", imagen: "perfume2.avif", precio: 34.90},
      {id :3, nombre: "Esencia Noa 03" , descripcion: "aroma fresco almizclado y amaderado", imagen: "perfume3.avif", precio: 39.90},
      {id :4, nombre: "Esencia Noa 04" , descripcion: "aroma fresco almizclado y amaderado", imagen: "perfume4.avif", precio: 32.90},
      {id :5, nombre: "Esencia Noa 05" , descripcion: "aroma fresco almizclado y amaderado", imagen: "perfume5.avif", precio: 36.90},
      {id :6, nombre: "Esencia Noa 06" , descripcion: "aroma fresco almizclado y amaderado", imagen: "perfume6.avif", precio: 27.90},
      {id :7, nombre: "Esencia Noa 07" , descripcion: "aroma fresco almizclado y amaderado", imagen: "perfume7.avif", precio: 42.90},
      {id :8, nombre: "Esencia Noa 08" , descripcion: "aroma fresco almizclado y amaderado", imagen: "perfume8.avif", precio: 31.90},
      {id :9, nombre: "Esencia Noa 09" , descripcion: "aroma fresco almizclado y amaderado", imagen: "perfume9.avif", precio: 37.90},
      {id :10, nombre: "Esencia Noa 010" , descripcion: "aroma fresco almizclado y amaderado", imagen: "perfume10.avif", precio: 44.90},
      
]

const productosContainer = document.getElementById("products") //contenedor donde se van a mostrar los productos
const itemsCarrito = document.getElementById("cart-items") //contenedor donde se muestran las lineas del carrito
const mostrarCarrito = document.getElementById("toggle-cart") //icono para mostar u  ocultar el carrito
const carrito = document.getElementById("cart") //total del carrito inicialmente a 0
const toalCarrito = document.getElementById("cart-total") //total del carrito, inicialmente a cero
const contador = document.getElementById("contador") //para mostrar cuantos articulos hay en el carrito



// array para guardar los productos del carrito
let carritoProductos = []

//funcion para mostrar los productos
function mostrarProductos(){
    productosContainer.innerHTML = producutos.map((producto) => 
        `
        <article class="producto">
            <img src="img/imgavifparfum/${producto.imagen}" alt="${producto.nombre}" loading="lazy">
            <h2>${producto.nombre}</h2>
            <p class="precio">${producto.precio} €</p>
            <button class="addProducto" data-id="${producto.id}" type="button">añadir al carrito</button>
        </article>
        `
    ).join("")
    const btnAddCarrito = document.querySelectorAll(".addProducto")
    btnAddCarrito.forEach(btn => {
        btn.addEventListener("click", addCarrito)

    })

}
function addCarrito(e){
    console.log(e.target.getAttribute("data-id"))
    const productoId = parseFloat(e.target.getAttribute("data-id"))
    const productoComprado = producutos.find(producuto => producuto.id === productoId)
    carritoProductos.push(productoComprado)
    actualizarCarrito()

    function actualizarCarrito(){
        itemsCarrito.innerHTML = carritoProductos.map((item) =>
       `
         <div class="cart-item">
         <p>${item.nombre}</p>
         <p>${item.precio.toFixed(2)}</p>
         </div>


       `
    ).join("")
    }
}
mostrarProductos()