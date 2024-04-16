(function(){

    // Si el navegador no soporta indexedDB, se activará el alert y el log
    if (!window.indexedDB){ 
        alert("Su navegador no soporta una versión estable de IndexedDB. Por lo que la funcionalidad no está disponible.");
        console.log(`El navegador no soporta indexedDB`);
        return; // Salir de la función si indexedDB no está disponible
    }

    // Abre una conexión a la base de datos 
    const request = indexedDB.open('Almacen', 1);

    // Manejador de error al abrir la base de datos
    request.onerror = function(event){ 
        alert("Error al abrir la base de datos");
        console.log(`Error al abrir la base de datos: ${event.target.errorCode}`);
    }

    // Este evento activa la primera vez que se crea la base de datos o cuando se cambia la versión
    request.onupgradeneeded = function(event){
        // Se obtiene la base de datos
        const db = event.target.result;

        // Se crean las "tablas" que son en realidad objetos, con la condicional que no existan previamente, sino son borradas.
        
        if (!db.objectStoreNames.contains('clientes')) {
            let clientes = db.createObjectStore('clientes', { keyPath: "id_cliente", autoIncrement: false });
        } else {
            alert('Ya existe la tabla clientes');
        }

        if (!db.objectStoreNames.contains('ventas')) {
            let ventas = db.createObjectStore('ventas', { keyPath: "id_venta", autoIncrement: true });
        } else {
            alert('Ya existe la tabla ventas');
        }

        if (!db.objectStoreNames.contains('productos')) {
            let productos = db.createObjectStore('productos', { keyPath: "id_producto", autoIncrement: true });
        } else {
            alert('Ya existe la tabla productos');
        }
    };
    
    // Este evento activa cuando la base de datos se abre correctamente
    request.onsuccess = function(event){
        
        console.log(`Base de datos abierta correctamente`);
        alert('Base de datos abierta correctamente');

        // Se obtiene la base de datos
        const db = event.target.result;

        // Métodos para agregar un cliente, venta, producto a la base de datos
        window.agregarCliente = function(cliente){
            // Se inicia una transacción de lectura y escritura
            const transaction = db.transaction(['clientes'], 'readwrite');
            // Se obtiene el almacen
            const almacen = transaction.objectStore('clientes');
            // Se agrega el cliente
            const request = almacen.add(cliente);
        }

        window.agregarVenta = function(venta){
            // Se inicia una transacción de lectura y escritura
            const transaction = db.transaction(['ventas'], 'readwrite');
            // Se obtiene el almacen
            const almacen = transaction.objectStore('ventas');
            // Se agrega la venta
            const request = almacen.add(venta);
        }

        window.agregarProducto = function(producto){
            // Se inicia una transacción de lectura y escritura
            const transaction = db.transaction(['productos'], 'readwrite');
            // Se obtiene el almacen
            const almacen = transaction.objectStore('productos');
            // Se agrega el producto
            const request = almacen.add(producto);
        }

        window.obtenerClientePorId = function(id_cliente, callback){
            // Se inicia una transacción de lectura buscando el cliente por Id
            const transaccion = db.transaction(['clientes'], 'readonly');
            const almacen = transaccion.objectStore('clientes');

            // Se obtiene el cliente
            const request = almacen.get(id_cliente);

            // Se retorna el resultado de la consulta
            request.onsuccess = function(event){
                const cliente = request.result;
                if(cliente) {
                    console.log('cliente encontrado:', cliente);
                    if(callback) callback(cliente);
                } else {
                    console.log('No se encontró el cliente con el id:', id_cliente);
                    if(callback) callback(null);
                }
            };
            
            request.onerror = function(event){
                console.error(`Error al obtener el cliente con el id: ${id_cliente}`);
                alert(`Error al obtener el cliente con el id: ${id_cliente}`);
            };
        }

        window.obtenerProductoPorId = function(id_producto, callback){
            // Se inicia una transacción de lectura buscando el producto por Id
            const transaccion = db.transaction(['productos'], 'readonly');
            const almacen = transaccion.objectStore('productos');
            
            // Se obtiene el producto
            const request = almacen.get(id_producto);

            // Se retorna el resultado de la consulta
            request.onsuccess = function(event){
                const producto = request.result;
                if(producto) {
                    console.log(`Se encontro el producto: ${producto.descripcion}`);
                    if(callback) callback(producto);
                } else {
                    console.log('No se encontró el producto con el id:', id_producto);
                    if(callback) callback(null);
                }
            };

            request.onerror = function(event){
                console.error(`Error al obtener el producto con el id: ${id_producto}`);
                alert(`Error al obtener el producto con el id: ${id_producto}`);
            }
        }

        window.obtenerVentaPorId = function(id_venta, callback){
            // Se inicia una transacción de lectura buscando la venta por Id
            const transaccion = db.transaction(['ventas'], 'readonly');
            const almacen = transaccion.objectStore('ventas');

            // Se obtiene la venta
            const request = almacen.get(id_venta);

            // Se retorna el resultado de la consulta
            request.onsuccess = function(event){
                const venta = request.result;
                if (venta) {
                    console.log(`Se realizo una venta con ${venta.fecha} vendida a: ${venta.id_cliente} por una cantidad de: ${venta.cantidad}`);
                    if (callback) callback(venta);
                } else {
                    console.log('No se encontró la venta con el id:', id_venta);
                    if (callback) callback(null);
                }
            };

            request.onerror = function(event){
                console.error(`Error al obtener la venta con el id: ${id_venta}`);
                alert(`Error al obtener la venta con el id: ${id_venta}`);
            }
        }

        // FIXME: Arreglando de actualizar
        // función para actualizar un cliente y producto con un id específico
        window.actualizarCliente = function(id_cliente, update){
            // Se inicia una transacción de lectura y escritura
            const transaccion = db.transaction(['clientes'], 'readwrite');
            const almacen = transaccion.objectStore('clientes');
            const request = almacen.get(id_cliente);
            request.onsuccess = function(event){
                const cliente = request.result;
                cliente.nombre = 'Juan';
                cliente.direccion = 'Calle 123';
                cliente.telefono = '123456';
                const requestUpdate = almacen.put(update);
                requestUpdate.onsuccess = function(event){
                    console.log(`Cliente actualizado correctamente con el id: ${id_cliente}`);
                    alert(`Cliente actualizado correctamente con el id: ${id_cliente}`);	
                }
                requestUpdate.onerror = function(event){
                    console.error(`Error al actualizar el cliente con el id: ${id_cliente}`);
                    alert(`Error al actualizar el cliente con el id: ${id_cliente}`);
                }
            }
            request.onerror = function(event){
                console.error(`Error al obtener el cliente con el id: ${id_cliente}`);
                alert(`Error al obtener el cliente con el id: ${id_cliente}`);
            }
        }

        // try {
        //     // Usando objetos literales se agregan datos a las tablas
        //     // Agregar cliente
        //     agregarCliente({ nombre: 'Pedro', direccion: 'Calle 321', telefono: '098745' });
        //     agregarCliente({ nombre: 'Juan', direccion: 'Calle 123', telefono: '123456' });

        //     // Agregar producto
        //     agregarProducto({ descripcion: 'Producto 1', precio: 100 });
        //     agregarProducto({ descripcion: 'Producto 2', precio: 200 });
            
        //     // Agregar venta
        //     agregarVenta({ id_cliente: 1, id_producto: 1, fecha: new Date(), cantidad: 2, total: 200 });
        //     agregarVenta({ id_cliente: 2, id_producto: 2, fecha: new Date(), cantidad: 3, total: 600 });
            
        // } catch (error) {
        //     console.error(`Error al agregar un cliente, producto o venta:`, error);
        // }
}
})();