let carrito = [] // Variable global para almacenar el carrito de compras

let url = "https://jsonblob.com/api/1335554124770631680"


class Carrito {

    constructor(productos, currency) {
        this.productos = productos
        productos.forEach(producto => producto.quantity = 0)
        this.currency = currency
        this.total = 0
    }

    /*
        Función que actualiza las unidades de un producto que obtenemos en función de su SKU dado por parámetro.
        Es llamada cada vez que se pulsa cualquiera de los botones de aumentar o disminuir unidades de cada producto.
    */
    actualizarUnidades(SKU, unidades) {
        // Actualiza el número de unidades que se quieren comprar de un producto        
        const producto = this.productos.find(product => product.SKU === SKU)

        if (producto && (unidades === 1 || (unidades === -1 && producto.quantity > 0))) { //No deja unidades negativas
            producto.quantity += unidades
            this.total = this.productos.reduce((acc, product) => acc + product.quantity *
                parseFloat(product.price), 0)
        }
    }

    /*
        Función que devuelve la información de un producto que obtenemos en función de su SKU dado por parámetro.
    */
    obtenerInformacionProducto(SKU) {
        const producto = this.productos.find(p => p.SKU === SKU)

        if (producto) {
            return {
                SKU: producto.SKU,
                title: producto.title,
                price: producto.price,
                quantity: producto.quantity
            }
        }
    }


    /*
        Función que devuelve la informacion de todo el carrito, desde su total y su divisa, hasta los productos que lo componen
    */
    obtenerCarrito() {
        return {
            total: this.total,
            currency: this.currency,
            products: this.productos.map(producto => {
                return this.obtenerInformacionProducto(producto.SKU)
            })
        }
    }
}

/*
    Función que se encarga de inicializar la información de los productos desde la API.
    Es una vez que está inicializada cuando se lleva a cabo toda la lógica de la aplicación.
*/
function init(){
    // Cargar los productos desde el archivo JSON
    fetch(url)
    .then((response) => {
        response.json().then((data) => {
            // Recorrer los productos y agregarlos a la variable global
            debugger
            console.log(data)
            carrito = new Carrito(data.products, data.currency)
            
            mostrarListaProductos() 
            mostrarCarrito()
        })
    })
    .catch((error) => {
        console.error(error)
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
    carrito.productos.forEach((producto) => {
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
        quantityValue.textContent = producto.quantity
        priceCell.textContent = producto.price + carrito.currency
        totalCell.textContent = (producto.price * producto.quantity).toFixed(2) + carrito.currency

        // Eventos de botones
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

    // Limpiar la tabla antes de agregar nuevos datos
    tableBody.querySelectorAll(".post").forEach(row => row.remove()) //borro el valor de las filas para que asi al mostrar de nuevo se muestre solo lo actualizado
    tableBody.querySelectorAll(".totalTicket").forEach(row => row.remove()) //borro el valor del total para que asi al mostrar de nuevo se muestre solo lo actualizado

    // Obtengo la información del carrito
    const datos = carrito.obtenerCarrito()
    datos.products.forEach(producto => {
        if(producto.quantity > 0){
            const clone = ticketTemplate.content.cloneNode(true) // Clonamos el template
    
            // Rellenamos las celdas con los datos del producto
            const productNameCell = clone.querySelector(".ticketProductName")
            const productTotalCell = clone.querySelector(".ticketProductTotal")
    
            productNameCell.textContent = producto.title
            productTotalCell.textContent = (producto.price * producto.quantity).toFixed(2) + carrito.currency
    
            // Agregar la fila a la tabla
            tableBody.appendChild(clone)
        }
    })

    // Mostrar el total en la tabla
    const totalRow = totalTemplate.content.cloneNode(true)
    const totalCell = totalRow.querySelector("td:last-child")

    // Sumar todos los totales de productos
    const total = datos.products.reduce((acc, producto) => acc + (producto.price * producto.quantity), 0)
    
    totalCell.textContent = total.toFixed(2) + carrito.currency

    // Agregar la fila de total a la tabla
    tableBody.appendChild(totalRow)
}


