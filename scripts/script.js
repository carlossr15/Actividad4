let productos = []; // Variable global para almacenar los productos
let carrito = []; // Variable global para almacenar el carrito de compras

let url = "https://jsonblob.com/api/1335554124770631680"


function init(){
    // Cargar los productos desde el archivo JSON
    fetch(url)
    .then((response) => {
        response.json().then((data) => {
            // Recorrer los productos y agregarlos a la variable global
            console.log(data)
            carrito = new Carrito(data.products, data.currency)
            
            mostrarListaProductos() 
            mostrarCarrito()
        })
    })
    .catch((error) => {
        console.error(error);
    })

}

document.addEventListener('DOMContentLoaded', () => {

    init()

});



class Carrito {

    constructor(productos, currency) {
        this.productos = productos;
        productos.forEach(producto => producto.quantity = 0);
        this.currency = currency;
        this.total = 0;   
    }

    //Se tiene que llamar a esta funcion cuando se pulse el boton de aumentar o disminuir
    actualizarUnidades(SKU, unidades) {
        // Actualiza el número de unidades que se quieren comprar de un producto
        const producto = this.productos.find(product => product.SKU === SKU);
        if (producto) {
            producto.quantity += unidades;
            this.total = this.productos.reduce((acc, product) => acc + product.quantity *
            parseFloat(product.price), 0);
            mostrarListaProductos()
            mostrarCarrito()
        }
    }

    //Se llama a esta función para mostrar los productos en el "panel" de la izquierda
    obtenerInformacionProducto(SKU) {
        // Devuelve los datos de un producto además de las unidades seleccionadas
        // Por ejemplo
        // {
        // "SKU": "0K3QOSOV4V",
        // "quantity": 3
        // }
        const producto = this.productos.find(p => p.SKU === SKU);
        if (producto) {
            return {
                SKU: producto.SKU,
                title: producto.title,
                price: producto.price,
                quantity: producto.quantity
            };
        }

    }


    //Se llama a esta funcion para obtener la info del carrito y mostrarlo en el "panel" de la derecha
    obtenerCarrito() {
        // Devuelve información de los productos añadidos al carrito
        // Además del total calculado de todos los productos
        // Por ejemplo:
        // {
        // "total": "5820",
        // "currency: "€",
        // "products" : [
        // {
        // "SKU": "0K3QOSOV4V"
        // ..
        // }
        // ]}
        // }
        return {
            total: this.total,
            currency: "€",
            products: this.productos.map(producto => {
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


    function mostrarListaProductos(){
        const productsTable = document.getElementById('products_table');
        const postTemplate = document.getElementById('post-template')

        //Elimina el tr post d ela tabla, esto lo hago para que no elimine el template, solo lo que hay en él.
        productsTable.querySelectorAll(".post").forEach(row => row.remove());
        carrito.productos.forEach((producto) => {
            const post = postTemplate.content.cloneNode(true);

            const row = post.querySelector(".post");
            const titleCell = post.querySelector(".title");
            const priceCell = post.querySelector(".price");
            const quantityValue = post.querySelector(".quantity-value");
            const totalCell = post.querySelector(".total");
            const btnIncrease = post.querySelector(".increase");
            const btnDecrease = post.querySelector(".decrease");

            row.setAttribute("data-sku", producto.SKU);
            titleCell.textContent = producto.title;
            quantityValue.textContent = producto.quantity;
            priceCell.textContent = producto.price + carrito.currency;
            totalCell.textContent = (producto.price * producto.quantity).toFixed(2) + carrito.currency;

            // Eventos de botones
            btnIncrease.addEventListener("click", () => carrito.actualizarUnidades(producto.SKU, 1));
            btnDecrease.addEventListener("click", () => carrito.actualizarUnidades(producto.SKU, -1));


            productsTable.appendChild(post);

        })
    }

    function mostrarCarrito() {
        const tableBody = document.getElementById("ticket_table");
        const ticketTemplate = document.getElementById("ticket-template");
        const totalTemplate = document.getElementById("total-template");
    
        // Limpiar la tabla antes de agregar nuevos datos
        tableBody.querySelectorAll(".post").forEach(row => row.remove()); //borro el valor de las filas para que asi al mostrar de nuevo se muestre solo lo actualizado
        tableBody.querySelectorAll(".totalTicket").forEach(row => row.remove()); //borro el valor del total para que asi al mostrar de nuevo se muestre solo lo actualizado

        // Mostrar los productos en la tabla
        const datos = carrito.obtenerCarrito()
        datos.products.forEach(producto => {
            if(producto.quantity > 0){
                const clone = ticketTemplate.content.cloneNode(true); // Clonamos el template
        
                // Rellenamos las celdas con los datos del producto
                const productNameCell = clone.querySelector(".ticketProductName");
                const productTotalCell = clone.querySelector(".ticketProductTotal");
        
                productNameCell.textContent = producto.title;
                productTotalCell.textContent = (producto.price * producto.quantity).toFixed(2) + " €";
        
                // Agregar la fila a la tabla
                tableBody.appendChild(clone);
            }
        });
    
        // Mostrar el total en la tabla
        const totalRow = totalTemplate.content.cloneNode(true);
        const totalCell = totalRow.querySelector("td:last-child");
    
        // Sumar todos los totales de productos
        const total = datos.products.reduce((acc, producto) => acc + (producto.price * producto.quantity), 0);
        
        totalCell.textContent = total.toFixed(2) + " €";
    
        // Agregar la fila de total a la tabla
        tableBody.appendChild(totalRow);
    }


