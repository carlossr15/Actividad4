
let url = "https://jsonblob.com/api/1335554124770631680"
let productos = [] //Array que contiene todos los productos disponibles de la tienda
let carrito = [] //Variable global para almacenar el carrito de compras

class Carrito {

    constructor(productos, currency) {
        this.productosCarrito = productos //Aray de productos del carrito
        this.currency = currency //Divisa del carrito
        this.total = 0 //Total acumulado del carrito
    }

    /*
        Función que actualiza las unidades de un producto que obtenemos en función de su SKU dado por parámetro.
        Es llamada cada vez que se pulsa cualquiera de los botones de aumentar o disminuir unidades de cada producto.
    */
    actualizarUnidades(SKU, unidades) {
        const producto = productos.find(product => product.SKU === SKU)

        if (producto && (unidades === 1 || (unidades === -1 && producto.quantity > 0))) { //No deja unidades negativas
            if(!this.productosCarrito.find(p => p.SKU === SKU)) { //Si no existe este producto en e carrito
                producto.quantity = 1
                this.productosCarrito.push(producto)                
            } else {
                producto.quantity += unidades
                if(producto.quantity === 0){ //Si las unidades del producto en el carrito son 0, se elimina del carrito
                    this.eliminarProductoDelCarrito(producto.SKU)
                }
            }
            
            this.total = this.productosCarrito.reduce((acc, product) => acc + product.quantity *
                parseFloat(product.price), 0)
        }
    }

    /*
        Función que elimina del carrito un producto que obtenemos en función de su SKU dado por parámetro.
    */
    eliminarProductoDelCarrito(SKU){
        let index = this.productosCarrito.findIndex(p => p.SKU === SKU)

        if (index !== -1) {
            this.productosCarrito.splice(index, 1)
        }
    }

    /*
        Función que devuelve las unidades y el SKU de un producto que obtenemos en función de su SKU dado por parámetro.
    */
    obtenerInformacionProducto(SKU) {
        const producto = this.productosCarrito.find(p => p.SKU === SKU)

        return producto ? { SKU: producto.SKU, quantity: producto.quantity } : { SKU, quantity: 0 } //Si no existe el producto devuelve 0

    }


    /*
        Función que devuelve la información de todo el carrito, desde su total y su divisa, hasta los productos que lo componen
    */
    obtenerCarrito() {
        return {
            total: this.total,
            currency: this.currency,
            products: this.productosCarrito.map(producto => {
                return {
                    SKU: producto.SKU,
                    title: producto.title,
                    price: producto.price,
                    quantity: producto.quantity
                }
            })
        }
    }
}

/*
    Función que se encarga de inicializar la información de los productos desde la API.
    Es una vez que está inicializada cuando se lleva a cabo toda la lógica de la aplicación.
*/
function init(){
    fetch(url)
    .then((response) => {
        response.json().then((data) => {
            //Recorrer los productos y agregarlos a la variable global
            currency = data.currency
            productos = data.products 
            carrito = new Carrito([], data.currency)
            mostrarListaProductos() 
            mostrarCarrito()
        })
    })
    .catch((error) => {
        console.error(error)
        alert("Hubo un problema al cargar los productos. Inténtalo más tarde.")
    })
}


document.addEventListener('DOMContentLoaded', () => {
    init() 
})





function mostrarListaProductos(){
    const productsTable = document.getElementById('products_table')
    const postTemplate = document.getElementById('post-template')

    //Elimina el tr post d ela tabla, esto lo hago para que no elimine el template, solo lo que hay en él.
    productsTable.querySelectorAll(".post").forEach(row => row.remove())
    productos.forEach((producto) => {
        const post = postTemplate.content.cloneNode(true)

        //Obtengo todos los elementos de la tabla para luego darles valor
        const titleCell = post.querySelector(".productTitle")
        const SKUCell = post.querySelector(".productSKU")
        const priceCell = post.querySelector(".price")
        const quantityValue = post.querySelector(".quantity-value")
        const totalCell = post.querySelector(".total")
        const btnIncrease = post.querySelector(".increase")
        const btnDecrease = post.querySelector(".decrease")

        SKUCell.textContent = "Ref: " + producto.SKU
        titleCell.textContent = producto.title

        let quantity = 0
        const infoProducto = carrito.obtenerInformacionProducto(producto.SKU)
        if (infoProducto) { //Comprueba si hay unidades de ese producto en el carrito
            quantity = infoProducto.quantity
        }

        quantityValue.textContent = quantity
        priceCell.textContent = producto.price + carrito.currency
        totalCell.textContent = (producto.price * quantity).toFixed(2) + carrito.currency

        //Eventos de botones
        btnIncrease.addEventListener("click", () => {
            carrito.actualizarUnidades(producto.SKU, 1)
            mostrarListaProductos()
            mostrarCarrito()    
        })
        btnDecrease.addEventListener("click", () => {
            carrito.actualizarUnidades(producto.SKU, -1)
            mostrarListaProductos()
            mostrarCarrito()    
        })
        
        productsTable.appendChild(post)
    })
}

function mostrarCarrito() {
    const tableBody = document.getElementById("ticketTable_body")
    const ticketTemplate = document.getElementById("ticket-template")
    const totalTemplate = document.getElementById("total-template")

    //Limpiar la tabla antes de agregar nuevos datos
    tableBody.querySelectorAll(".post").forEach(row => row.remove()) //borro el valor de las filas para que asi al mostrar de nuevo se muestre solo lo actualizado
    tableBody.querySelectorAll(".totalTicket").forEach(row => row.remove()) //borro el valor del total para que asi al mostrar de nuevo se muestre solo lo actualizado

    //Obtengo la información del carrito
    const datos = carrito.obtenerCarrito()

    datos.products.forEach(producto => {
        if(producto.quantity > 0){
            //Clonams el template
            const clone = ticketTemplate.content.cloneNode(true) 
    
            //Datos del producto
            const productNameCell = clone.querySelector(".ticketProductName")
            const productTotalCell = clone.querySelector(".ticketProductTotal")
    
            productNameCell.textContent = producto.title
            productTotalCell.textContent = (producto.price * producto.quantity).toFixed(2) + carrito.currency
    
            tableBody.appendChild(clone)
        }
    })

    //Total en la tabla
    const totalRow = totalTemplate.content.cloneNode(true)
    const totalCell = totalRow.querySelector("td:last-child")

    //Suma de los totales de cada producto
    const total = datos.products.reduce((acc, producto) => acc + (producto.price * producto.quantity), 0)
    
    totalCell.textContent = total.toFixed(2) + carrito.currency

    tableBody.appendChild(totalRow)
}


