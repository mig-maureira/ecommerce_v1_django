import { Productos } from './datos.js';  //llama la tabla de productos desde datos

const CART_KEY = 'almacarro'; // define nombre de la tabla para este archivo

export const backend = {  // funcion llama todo en bd ficticio seria el SELECT * FROM
   
    obtenertodo: () => {
        return Productos; 
    },

    obtenerPorId: (id) => {     //funcion que llama por ID  el parseint es para llamar solo numeros buena practica 
        return Productos.find(p => p.id === parseInt(id));
    },

    obtenerCarrito: () => {    //busca la cantidad de datos guardados 
        const data = localStorage.getItem(CART_KEY);
        return data ? JSON.parse(data) : []; // solo busca texto y lo transoforma en objeto  y permite estar en 0 otorga carro nuevo
    },

 
    agregarAlCarrito: (idProducto) => {   //funcion que realiza la compra
        const producto = Productos.find(p => p.id === idProducto);
        if (!producto) return alert("Error: Producto no existe"); //verifica que el id existe

        let carrito = backend.obtenerCarrito();   //llama la canasta del localstorage
        
        const itemExistente = carrito.find(item => item.id === idProducto); //funcion que busca si existe no duplica el producto  y le suma 1 al contador 

        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            
            carrito.push({ ...producto, cantidad: 1 });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(carrito));  //persistencia  commit  guarda cambios de forma explosiva  recordar solo lee texto 
        
        return carrito.reduce((acc, item) => acc + item.cantidad, 0); // actuliza el carro y lo envia para que la conexion le indique al carro que tiene 1 producto nuevo
    },

 
    restarDelCarrito: (idProducto) => { // funcion de botones para restar producto
        let carrito = backend.obtenerCarrito();
        const item = carrito.find(item => item.id === idProducto);

        if (item) {
            item.cantidad--;

         
            if (item.cantidad <= 0) {
                carrito = carrito.filter(p => p.id !== idProducto);
            }
            
       
            localStorage.setItem(CART_KEY, JSON.stringify(carrito));
        }
        
        return backend.contarItems();
    },

   
    eliminarItem: (idProducto) => { // funcion del borrar del carro el producto
        let carrito = backend.obtenerCarrito();
        
        
        carrito = carrito.filter(p => p.id !== idProducto);
        
        localStorage.setItem(CART_KEY, JSON.stringify(carrito));
        
        return backend.contarItems();
    },
    contarItems: () => {
        const carrito = backend.obtenerCarrito();
        return carrito.reduce((acc, item) => acc + item.cantidad, 0);
    }
};