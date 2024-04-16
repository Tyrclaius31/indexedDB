(function(){ // Función anónima autoejecutable - IIFE

    // Si el navegador no soporta indexedDB, se activará el alert y el log
    if (!window.indexedDB){ 
        alert("Su navegador no soporta una versión estable de IndexedDB. Por lo que la funcionalidad no está disponible.");
        console.log(`El navegador no soporta indexedDB`);
    }

    // Creación de la base de datos con dos parámetros. 1ro el nombre de la bb.dd. 
    // Y 2do la versión
    const baseDatosRequest = indexedDB.open('Almacen', 3); 

    // // Si hay un error en la creación de la bb.dd. se activará el alert y el log
    baseDatosRequest.onerror = function(event){ 
        alert("Error al abrir la base de datos");
        console.log(`Error al abrir la base de datos: ${event.target.errorCode}`);
    }

    // Si la bb.dd. se creó correctamente, se activará el log
    baseDatosRequest.onsuccess = function(event){ 
        console.log(`Base de datos abierta correctamente`);
    }
    
    // Si la bb.dd. se creó correctamente o abrió, se activará el log
    baseDatosRequest.onupgradeneeded = function(event){ 
        
        // Se adquiere el objetivo dentro de indexedDB que es la bb.dd.
        let db = event.target.result;

        // Creando objetos que serían las tablas de la bb.dd.
        let clientes = db.createObjectStore('clientes', {autoIncrement: true});
        let ventas = db.createObjectStore('ventas', {autoIncrement: true});
        let productos = db.createObjectStore('productos', {autoIncrement: true});
        let productos1 = db.createObjectStore('productos1', {autoIncrement: true});

        // Agregando índices a las tablas

        // Tabla Clientes
        clientes.createIndex('id_cliente', 'id_cliente', {unique: true});
        clientes.createIndex('nombre', 'nombre', {unique: false});
        clientes.createIndex('direccion', 'direccion', {unique: false});
        clientes.createIndex('telefono', 'telefono', {unique: false});

        // Tabla Ventas
        ventas.createIndex('id_venta', 'id_venta', {unique: false});
        ventas.createIndex('fecha', 'fecha', {unique: false});
        ventas.createIndex('cantidad', 'telefono', {unique: false});
    
        // Tabla Productos
        productos.createIndex('id_producto', 'id_producto', {unique: false});
        productos.createIndex('descripcion', 'descripcion', {unique: false});
        productos.createIndex('precio', 'precio', {unique: false}); 

        // await deleteDB('nombre_db'); 
        
    }
    

})();