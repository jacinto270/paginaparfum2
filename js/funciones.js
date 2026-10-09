
// datos de entarda


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


// elementos del dom - document objet model
const productosContainer = document.getElementById("products") //contenedor donde se van a mostrar los productos
const itemsCarrito = document.getElementById("cart-items") //contenedor donde se muestran las lineas del carrito
const mostrarCarrito = document.getElementById("toggle-cart") //icono para mostar u  ocultar el carrito
const carrito = document.getElementById("cart") //total del carrito inicialmente a 0
const toalCarrito = document.getElementById("cart-total") //total del carrito, inicialmente a cero
const contador = document.getElementById("contador") //para mostrar cuantos articulos hay en el carrito



// array para guardar los productos del carrito
let carritoProductos =  JSON.parse(localStorage.getItem("carritoProductos")) || []



// variable para contar el numero de productos en el carrito
let numeroProductos =  parseInt(localStorage.getItem("numeroProductos")) || 0

actualizarCarrito()

//funcion para mostrar los productos en pantalla
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


 // funcion para actualizar el carrito
function actualizarLocalStorage(){
  localStorage.setItem("carritoProductos", JSON.stringify(carritoProductos))
        localStorage.setItem("numeroProductos", numeroProductos)
   
}

// funcion para añadir al carrito
function addCarrito(e){
    console.log(e.target.getAttribute("data-id"))
    const productoId = parseFloat(e.target.getAttribute("data-id"))
    const productoComprado = producutos.find(producuto => producuto.id === productoId)

    // comprobar si ya hay un producto en el igual en el carrito
    // si ya tenemos un producto igual en el carrito, le añadimos 1 ala cantidad


      const lineaCarrito = carritoProductos.find(producto => producto.id === productoComprado.id)

    //  si ya tenemos un producto igual en el carrito, le añadimos 1 ala cantidad
    if(lineaCarrito){
        console.log("el producto ya esta en el carrito")
        lineaCarrito.cantidad = lineaCarrito.cantidad + 1
    }else{
         const productoCarrito = productoComprado
         productoCarrito.cantidad = 1
         carritoProductos.push(productoCarrito)
         }
     
         numeroProductos++
        actualizarLocalStorage()
         actualizarCarrito()


   }

// funcion para mostar los productos en pantalla
    function actualizarCarrito(){
        itemsCarrito.innerHTML = carritoProductos.map((item) =>
       `
         <div class="cart-item">
          <button class="restarProducto" data-id="${item.id}">-</button>
         <p>${item.cantidad}</p>
         <button class="sumarProducto" data-id="${item.id}">+</button>
         <p>${item.nombre}</p>
         <p>${item.precio.toFixed(2)}</p>
          <p>${(item.precio * item.cantidad).toFixed(2)}</p>
         </div>


       `
    ).join("")

    const botonesSumar = document.querySelectorAll(".sumarProducto")
    botonesSumar.forEach(btn => {
        btn.addEventListener("click", sumarProducto)
    })



     const botonesrestar = document.querySelectorAll(".restarProducto")
    botonesrestar.forEach(btn => {
        btn.addEventListener("click", restarProducto)
    })

// calcular el total y mostrar en pantalla
// reduce devuelve la suma de todos los valores de la ppropiedad precio, con un valor inicial 0
     const total = carritoProductos.reduce((suma, item) => suma + (item.precio * item.cantidad), 0)
     toalCarrito.textContent = "total: " + total.toFixed(2) + " €"

     if (numeroProductos === 0) {
        contador.textContent = ""
        }else{
            contador.textContent = numeroProductos
        }
    

    }
    // funcion para sumar un producto al carrito
    function sumarProducto(e){
        const productoId = parseFloat(e.target.getAttribute("data-id"))
        // busco la linea de carrito correspondiente
        const lineaCarrito = carritoProductos.find(producto => producto.id === productoId)
        console.log (lineaCarrito)
        lineaCarrito.cantidad = lineaCarrito.cantidad + 1


         numeroProductos++
         actualizarLocalStorage()
         actualizarCarrito()


        }
// funcion para restar un producto al carrito
    function restarProducto(e){
        const productoId = parseFloat(e.target.getAttribute("data-id"))
        // busco la linea de carrito correspondiente
        const lineaCarrito = carritoProductos.find(producto => producto.id === productoId)
        if(lineaCarrito.cantidad === 1){

            carritoProductos = carritoProductos.filter(producto => producto.id !== productoId)

        }else{
           lineaCarrito.cantidad = lineaCarrito.cantidad - 1
        }
         numeroProductos--
         actualizarLocalStorage()
         actualizarCarrito()
        }
// funcion para mostrar u ocultar el carrito
        mostrarCarrito.addEventListener("click", () => {
            console.log("hola")
            carrito.classList.toggle("open")
        })

mostrarProductos()