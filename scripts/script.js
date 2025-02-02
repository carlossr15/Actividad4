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
        })
    })
    .catch((error) => {
        console.error(error);
    })

}

document.addEventListener('DOMContentLoaded', () => {

    init()




    // const productos = [
    //     new Product("id1", "iPhone 13 Pro", 939.5, 0, 0),
    //     new Product("id2", "Cargador", 49.99, 0, 0),
    //     new Product("id3", "Funda de piel", 79.99, 0, 0),
    //     new Product("id4", "AirPods", 199.99, 0, 0)
    // ];

    // mostrarProductos()

    /*const ticketTable = document.getElementById("ticket_table");

    let ticketTemplate = document.querySelector('#ticket-template')
    let totalTemplate = document.querySelector('#total-template');

    function renderizarProductos(){
        // Borrar contenido anterior
        ticketTable.innerHTML = '';

        const newCarrito = carrito.obtenerCarrito()

        // Iterar sobre los productos del carrito
        newCarrito.products.forEach((producto) => {
            if (producto.quantity > 0) {
                // Clonar el template para cada producto
                const nuevoTicket = ticketTemplate.content.cloneNode(true);

                // Llenar los datos del producto
                nuevoTicket.querySelector(".ticketProductName").textContent = producto.name;
                nuevoTicket.querySelector(".ticketProductTotal").textContent = producto.total;

                // Agregar la fila del producto al ticketTable
                ticketTable.appendChild(nuevoTicket);
            }
        });

        // Clonar y agregar el template del total al final
        const totalTicketElement = totalTemplate.content.cloneNode(true);
        totalTicketElement.querySelector(".totalTicket td:last-child").textContent = newCarrito.total;

        // Agregar la fila del total
        ticketTable.appendChild(totalTicketElement);
    }

    renderizarProductos();*/

});

/*
class Product {

    constructor(SKU, title, price, quantity, total){
        this.SKU = SKU;
        this.title = title;
        this.price = price;
        this.quantity = quantity;  
    }

    // Función para actualizar la cantidad
    updateQuantity(change, unitsSpan, totalCell) {
        if (this.units + change >= 0) { // Evitar valores negativos
            this.units += change;
            this.total = this.units * this.price;

            // Actualizar UI
            unitsSpan.textContent = this.units;
            totalCell.textContent = this.total.toFixed(2) + "€";
        }
    }
}*/



class Carrito {

    constructor(productos, currency) {
        this.productos = productos;
        productos.forEach(producto => producto.quantity = 0);
        this.currency = currency;
        this.total = 0;   
    }

    //Se tiene que llamar a esta funcion cuando se pulse el boton de aumentar o disminuir
    actualizarUnidades(SKU, unidades) {
        debugger
        // Actualiza el número de unidades que se quieren comprar de un producto
        const producto = this.productos.find(product => product.SKU === SKU);
        if (producto) {
            producto.quantity += unidades;
            this.total = this.productos.reduce((acc, product) => acc + product.quantity *
            parseFloat(product.price), 0);
            mostrarListaProductos()
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
                name: producto.title,
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
                    name: producto.title,
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
            debugger
            totalCell.textContent = parseFloat(producto.price * producto.quantity).toFixed(2) + carrito.currency;

            // Eventos de botones
            btnIncrease.addEventListener("click", () => carrito.actualizarUnidades(producto.SKU, 1));
            btnDecrease.addEventListener("click", () => carrito.actualizarUnidades(producto.SKU, -1));


            productsTable.appendChild(post);

        })
    }

        function mostrarProductos(data){
            // Aquí ya puedes renderizar los productos después de que se cargaron
            const productsTable = document.getElementById("products_table");

            carrito = new Carrito(data.products)
            const postTemplate = document.querySelector('#post-template')
            const i = carrito.obtenerCarrito();
            carrito.obtenerCarrito().products.forEach((producto) => {
                const nuevoPost = postTemplate.content.cloneNode(true)
        
                nuevoPost.querySelector(".title").textContent = producto.name;
                nuevoPost.querySelector(".price").textContent = producto.price;
                nuevoPost.querySelector(".total").textContent = producto.total + "€";
        
                // Obtener referencias a los elementos dentro del template
                const unitsSpan = nuevoPost.querySelector(".unit-value");
                const totalCell = nuevoPost.querySelector(".total");
        
                // Inicializar el valor de unidades
                unitsSpan.textContent = producto.units;
        
                // Asignar eventos a los botones
                nuevoPost.querySelector(".decrease").onclick = () => {
                    producto.updateQuantity(-1, unitsSpan, totalCell);
                    carrito.actualizarUnidades(producto.id, producto.units)
                    renderizarProductos()
                }
        
                nuevoPost.querySelector(".increase").onclick = () => {
                    producto.updateQuantity(1, unitsSpan, totalCell);            
                    carrito.actualizarUnidades(producto.id, producto.units)
                    renderizarProductos()
                }
        
                // Agregar fila clonada a la tabla
                productsTable.appendChild(nuevoPost);
        
        
            });
            // Aquí va el código para renderizar los productos en la página
            

        }

