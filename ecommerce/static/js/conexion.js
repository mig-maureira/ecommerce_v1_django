import { backend } from './localstorage.js'; // importa backend que es el modelo de agregar borrar obtener productos

//DOM donde se van a inserar
const contenedorProductos = document.getElementById('products-grid'); // las cards
const contadorBadge = document.getElementById('cart-counter');  // la alerta del carro 
const contenedorCarrito = document.getElementById('cart-items-container'); //off canvas menu lateral
const totalCarritoElem = document.getElementById('cart-total'); //precio final


// function renderizarProductos() { //funcion que crea las cards de productos y crea el html 
    
//     const productos = backend.obtenertodo();

   
//     contenedorProductos.innerHTML = '';

//     productos.forEach(prod => {
       
//         const precioCLP = new Intl.NumberFormat('es-CL', { //para convertir a pesos chilenos 
//             style: 'currency', currency: 'CLP'
//         }).format(prod.precio);

//         //validacion de img si no hay asociada en productos le genera una imagen como blanca 
//         const imagenSrc = (prod.imagen === "#" || !prod.imagen) 
//             ? "./ASSETS/IMG/blanco.png"
//             : prod.imagen;

//         //stock opcional para desahibilar si no hay stock el boton 
//         let btnDisabled = '';
//         let btnTexto = 'Agregar';
        
//         if (prod.stock === 0) {
//             btnDisabled = 'disabled';
//             btnTexto = 'Agotado';
//         }

//         //html de las cards
//         const cardHTML = `
//             <div class="col-md-4 product-col mb-4">
//                 <article class="product-card h-100">
//                     <div class="product-image-wrapper">
//                         <span class="category-tag">${prod.categoria || 'Cosmética'}</span>
//                         <img src="${imagenSrc}" alt="${prod.nombre}">
//                     </div>
//                     <div class="card-body d-flex flex-column">
//                         <h5 class="card-title">${prod.nombre}</h5>
//                         <p class="small text-muted mb-3">${prod.descripcion}</p>
                        
//                         <div class="mt-auto d-flex justify-content-between align-items-center">
//                             <span class="price">${precioCLP}</span>
//                             <button 
//                                 class="btn btn-sm btn-alma-primary add-to-cart"
//                                 onclick="window.agregar(${prod.id})"
//                                 ${btnDisabled}
//                             >
//                                 ${btnTexto}
//                             </button>
//                         </div>
//                     </div>
//                 </article>
//             </div>
//         `;
//         contenedorProductos.innerHTML += cardHTML; //se inserta en el html 
//     });
// }

//funcion para el menu lateral muy similar a lo de arriba
function renderizarCarritoOffcanvas() {
    const carrito = backend.obtenerCarrito();
    
   
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="fas fa-leaf fa-3x mb-3" style="opacity: 0.3;"></i>
                <p>Tu carrito está vacío</p>
                <button class="btn btn-sm btn-alma-outline mt-2" data-bs-dismiss="offcanvas">Seguir Comprando</button>
            </div>`;
        totalCarritoElem.innerText = "$0";
        return; 
    }

    
    let htmlContent = '';
    let precioTotal = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        precioTotal += subtotal;

        const precioUnitario = new Intl.NumberFormat('es-CL', {
            style: 'currency', currency: 'CLP'
        }).format(item.precio);

        const img = (item.imagen === "#" || !item.imagen) ? "./assets/img/blanco.png" : item.imagen;

        htmlContent += `
            <div class="cart-item">
                <img src="${img}" class="cart-item-img" alt="${item.nombre}">
                
                <div class="cart-item-details">
                    <h5 class="cart-item-title">${item.nombre}</h5>
                    <span class="cart-item-price">${precioUnitario}</span>
                    
                    <div class="d-flex align-items-center mt-2">
                        <button class="btn btn-sm btn-outline-secondary px-2 py-0" onclick="window.cambiarCantidad(${item.id}, -1)">-</button>
                        <span class="mx-2 fw-bold">${item.cantidad}</span>
                        <button class="btn btn-sm btn-outline-secondary px-2 py-0" onclick="window.cambiarCantidad(${item.id}, 1)">+</button>
                    </div>
                </div>
                
                <div class="cart-item-actions">
                    <button class="btn-remove text-danger" onclick="window.eliminarItem(${item.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
    });

   
    contenedorCarrito.innerHTML = htmlContent;
    
    totalCarritoElem.innerText = new Intl.NumberFormat('es-CL', {
        style: 'currency', currency: 'CLP'
    }).format(precioTotal);
}

// actualiza el contador en el icono del carro 
function actualizarContadorVisual() {
    if (contadorBadge) {
        const total = backend.contarItems();
        contadorBadge.innerText = total;
        
        
        contadorBadge.classList.add('bg-warning');
        setTimeout(() => contadorBadge.classList.remove('bg-warning'), 300);
    }
}

// agregar por id al carro 
window.agregar = (id) => {
    backend.agregarAlCarrito(id);
    actualizarContadorVisual();
    renderizarCarritoOffcanvas(); 
    
    //biblioteca que reemplaza un alert 
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto agregado",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: "#fff",
        iconColor: "#7A8B69" 
    });
};

// controlador de botones + y - del carrito
window.cambiarCantidad = (id, cambio) => {
    if (cambio === 1) {
        backend.agregarAlCarrito(id);
    } else {
        backend.restarDelCarrito(id);
    }
    actualizarContadorVisual();
    renderizarCarritoOffcanvas();
};


window.eliminarItem = (id) => {
    backend.eliminarItem(id);
    actualizarContadorVisual();
    renderizarCarritoOffcanvas();
};

//ejecuta todas nuestras funciones 
document.addEventListener('DOMContentLoaded', () => {
    // Cargar todo
    renderizarProductos();        
    actualizarContadorVisual();   
    renderizarCarritoOffcanvas(); 

    // Lógica del botón pagar
    const btnPagar = document.querySelector('.offcanvas-footer .btn-alma-primary');
    
    if (btnPagar) {
        btnPagar.onclick = (e) => {
            e.preventDefault();
            const carrito = backend.obtenerCarrito();
            
            if (carrito.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Carrito vacío',
                    text: 'Agrega productos antes de finalizar la compra.',
                    confirmButtonColor: '#C4704A'
                });
            } else {
                let timerInterval;
                Swal.fire({
                    title: 'Procesando compra',
                    html: 'Redireccionando al portal de pago seguro...',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        window.location.href = urlPago;
                    }
                });
            }
        };
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES GLOBALES ---
    const searchBtn = document.getElementById('search-btn');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const productCols = document.querySelectorAll('.product-col');
    const noResultsMsg = document.getElementById('no-results');
    const clearSearchBtn = document.getElementById('clear-search');
    const productsSection = document.getElementById('productos');

   
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('open');
            setTimeout(() => searchInput.focus(), 300);
        });
    }

   
    function closeSearch() {
        searchOverlay.classList.remove('open');
        searchInput.value = ''; 
    }

    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', closeSearch);
    }

   
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
            closeSearch();
        }
    });

    
    // --- Lógica principal: FILTRADO AL ESCRIBIR ---
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            
            // 1. IMPORTANTE: Seleccionamos los productos AQUÍ DENTRO.
            // Esto asegura que encuentre las tarjetas generadas por renderizarProductos()
            const dynamicProductCols = document.querySelectorAll('.product-col');
            let visibleCount = 0;

            // 2. Scroll suave (esto ya lo tenías y está bien)
            if (term.length > 0 && productsSection) {
                const rect = productsSection.getBoundingClientRect();
                if (rect.top > window.innerHeight || rect.bottom < 0) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }

            // 3. EL FILTRADO (ESTO ES LO QUE TE FALTABA)
            dynamicProductCols.forEach(product => {
                // Intentamos leer el data-title, si no existe leemos el h5
                const titleAttr = product.getAttribute('data-title');
                const titleText = titleAttr ? titleAttr : product.querySelector('h5').innerText.toLowerCase();

                // Usamos 'important' para asegurar que sobreescriba el display de Bootstrap
                if (titleText.includes(term)) {
                    product.style.setProperty('display', 'block', 'important'); 
                    visibleCount++;
                } else {
                    product.style.setProperty('display', 'none', 'important');
                }
            });

            // 4. Mostrar mensaje "No hay resultados"
            if (noResultsMsg) {
                if (visibleCount === 0 && term.length > 0) {
                    noResultsMsg.classList.remove('d-none');
                } else {
                    noResultsMsg.classList.add('d-none');
                }
            }


            // AQUI PUEDES AGREGAR TU LÓGICA DE FILTRADO DE PRODUCTOS (visibleCount, etc.)
            
        }); 
    }

 
    
    const fabMain = document.getElementById('fab-main');
    const fabOptions = document.getElementById('fab-options');
    
    if (fabMain && fabOptions) {
        const fabIcon = fabMain.querySelector('i');

        fabMain.addEventListener('click', () => {
            fabOptions.classList.toggle('active');
            
           
            if (fabOptions.classList.contains('active')) {
                fabIcon.classList.remove('fa-comment-dots');
                fabIcon.classList.add('fa-times');
            } else {
                fabIcon.classList.remove('fa-times');
                fabIcon.classList.add('fa-comment-dots');
            }
        });
    }

}); 
        
/* //pruebas para limpiar cache
document.addEventListener('DOMContentLoaded', () => {
   
    localStorage.clear(); 
    
    renderizarProductos();
    actualizarContadorVisual();
});

*/
