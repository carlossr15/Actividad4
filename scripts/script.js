let productos = []; // Variable global para almacenar los productos
let carrito = []; // Variable global para almacenar el carrito de compras


document.addEventListener('DOMContentLoaded', () => {


    // const productos = [
    //     new Product("id1", "iPhone 13 Pro", 939.5, 0, 0),
    //     new Product("id2", "Cargador", 49.99, 0, 0),
    //     new Product("id3", "Funda de piel", 79.99, 0, 0),
    //     new Product("id4", "AirPods", 199.99, 0, 0)
    // ];

    mostrarProductos()

    const ticketTable = document.getElementById("ticket_table");

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

    renderizarProductos();

});


class Product {

    constructor(id, name, price, units, total){
        this.id = id;
        this.name = name;
        this.price = price;
        this.units = units;    
        this.total = total;    
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
}



class Carrito {

    constructor(productos) {
        this.productos = productos;
        this.total = 0;   
    }


    actualizarUnidades(sku, unidades) {
        // Actualiza el número de unidades que se quieren comprar de un producto
        const producto = this.productos.find(product => product.id === sku);
        if (producto) {
            producto.unidades = unidades;
            this.total = this.productos.reduce((acc, product) => acc + product.units *
            parseFloat(product.price), 0);
        }
    }


    obtenerInformacionProducto(sku) {
        // Devuelve los datos de un producto además de las unidades seleccionadas
        // Por ejemplo
        // {
        // "sku": "0K3QOSOV4V",
        // "quantity": 3
        // }
        const producto = this.productos.find(p => p.id === sku);
        if (producto) {
            return {
                sku: producto.id,
                name: producto.name,
                quantity: producto.units,
                price: producto.price,
                total: producto.total
            };
        }

    }



    obtenerCarrito() {
        // Devuelve información de los productos añadidos al carrito
        // Además del total calculado de todos los productos
        // Por ejemplo:
        // {
        // "total": "5820",
        // "currency: "€",
        // "products" : [
        // {
        // "sku": "0K3QOSOV4V"
        // ..
        // }
        // ]}
        // }
        return {
            total: this.total,
            currency: "€",
            products: this.productos.map(producto => {
                return this.obtenerInformacionProducto(producto.id)
            })
        }
    }
}



        //OPCION 1 DE LO QUE EXPLICÓ FELIX

        // let row = document.createElement("tr");

        // // Celda del nombre del producto
        // let productCell = document.createElement("td");
        // productCell.textContent = producto.name;

        // // Celda de los botones + Unidades
        // let buttonCell = document.createElement("td");

        // // Botón para disminuir
        // let decreaseButton = document.createElement("button");
        // decreaseButton.textContent = "-";
        // decreaseButton.onclick = () => producto.updateQuantity(producto, -1);

        // // Botón para aumentar
        // let increaseButton = document.createElement("button");
        // increaseButton.textContent = "+";
        // increaseButton.onclick = () => producto.updateQuantity(producto, 1);

        // //Unidades
        // let units = document.createElement("span");
        // units.id = `units-${producto.id}`;
        // units.textContent = producto.units;

        // //Celda del precio
        // let priceCell = document.createElement("td");
        // //priceCell.id = `price-${producto.id}`;
        // priceCell.textContent = producto.price.toFixed(2) + "€";

        // // Celda de total
        // let totalCell = document.createElement("td");
        // totalCell.id = `total-${producto.id}`;
        // totalCell.textContent = producto.total.toFixed(2) + "€";

        // // Agregar botones a la celda de acciones
        // buttonCell.appendChild(decreaseButton);
        // buttonCell.appendChild(units);
        // buttonCell.appendChild(increaseButton);

        // // Agregar celdas a la fila
        // row.appendChild(productCell);
        // row.appendChild(buttonCell);
        // row.appendChild(priceCell);
        // row.appendChild(totalCell);

        // // Agregar la fila a la tabla
        // productsTable.appendChild(row);




        async function mostrarProductos(){
            cargarProductos().then(() => {
                // Aquí ya puedes renderizar los productos después de que se cargaron
                const productsTable = document.getElementById("products_table");

                carrito = new Carrito(productos)
                const postTemplate = document.querySelector('#post-template')
                debugger
                const i = carrito.obtenerCarrito();
                carrito.obtenerCarrito().products.forEach((producto, index) => {
                    const nuevoPost = postTemplate.content.cloneNode(true)
            
                    nuevoPost.querySelector(".product").textContent = producto.name;
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
            }).catch(error => {
                console.error("Error al cargar los productos:", error);
            });


        }


        async function cargarProductos() {

            try {
                const response = await fetch("../productos.json"); // Cargar JSON
        
                if (!response.ok) {
                    throw new Error(`Error al cargar JSON: ${response.status}`);
                }
        
                const data = await response.json(); // Convertir JSON a objeto
        
                if (!data.products || !Array.isArray(data.products)) {
                    throw new Error("El JSON no contiene un array de productos.");
                }
        
                // Convertir los datos en instancias de Product
                productos = data.products.map(p => new Product(p.SKU, p.title, p.price, 0, 0));
        
                console.log("Productos cargados:", productos);
            } catch (error) {
                console.error("Error:", error);
            }
        }