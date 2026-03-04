document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DE BÚSQUEDA ---
    const searchBtn = document.getElementById('search-btn');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const productCols = document.querySelectorAll('.product-col');
    const noResultsMsg = document.getElementById('no-results');
    const clearSearchBtn = document.getElementById('clear-search');
    const productsSection = document.getElementById('productos');

    // Abrir buscador
    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('open');
        setTimeout(() => searchInput.focus(), 300); // Focus con pequeño delay
    });

    // Cerrar buscador
    function closeSearch() {
        searchOverlay.classList.remove('open');
        searchInput.value = ''; // Opcional: limpiar al cerrar o dejarlo
    }
    closeSearchBtn.addEventListener('click', closeSearch);

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
            closeSearch();
        }
    });

    // Filtrado en tiempo real
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        let visibleCount = 0;
        let shouldScroll = false;

        // Si hay término y estamos lejos de la sección de productos, hacer scroll suave
        if (term.length > 0) {
            // Solo hacer scroll si no estamos ya viendo la sección
            const rect = productsSection.getBoundingClientRect();
            if (rect.top > window.innerHeight || rect.bottom < 0) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        productCols.forEach(col => {
            const title = col.dataset.title; // Usamos el atributo data-title que añadimos al HTML
            if (title.includes(term)) {
                col.classList.remove('product-hidden');
                visibleCount++;
            } else {
                col.classList.add('product-hidden');
            }
        });

        // Mostrar mensaje de "no resultados"
        if (visibleCount === 0 && term !== '') {
            noResultsMsg.classList.remove('d-none');
        } else {
            noResultsMsg.classList.add('d-none');
        }
    });

    // Botón "Ver todos" en mensaje de error
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        productCols.forEach(col => col.classList.remove('product-hidden'));
        noResultsMsg.classList.add('d-none');
        searchInput.focus(); // Volver al input
    });


    // --- 2. LÓGICA SCROLL SPY (NAVEGACIÓN ACTIVA) ---
    const sections = document.querySelectorAll("header, section");
    const navLinks = document.querySelectorAll(".nav-link");

    function activateLink() {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    }
    window.addEventListener("scroll", activateLink);
    activateLink();

    // --- 3. LÓGICA BOTÓN FLOTANTE ---
    const fabMain = document.getElementById('fab-main');
    const fabOptions = document.getElementById('fab-options');
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

    // --- 4. LÓGICA CARRITO DE COMPRAS ---
    let cart = [];
    const cartButtons = document.querySelectorAll('.add-to-cart');
    const cartCounter = document.getElementById('cart-counter');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const formatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.qty++;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        updateCartUI();
        showAddedFeedback();
    }

    window.removeFromCart = function (id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    };

    window.changeQty = function (id, change) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) {
                removeFromCart(id);
            } else {
                updateCartUI();
            }
        }
    };

    function updateCartUI() {
        const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.transform = 'translate(-50%, -50%) scale(1.2)';
        setTimeout(() => cartCounter.style.transform = 'translate(-50%, -50%) scale(1)', 200);

        const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        cartTotalElement.textContent = formatter.format(totalPrice);

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                        <div class="text-center py-5 text-muted">
                            <i class="fas fa-leaf fa-3x mb-3" style="opacity: 0.3;"></i>
                            <p>Tu carrito está vacío</p>
                            <button class="btn btn-sm btn-alma-outline mt-2" data-bs-dismiss="offcanvas">Seguir Comprando</button>
                        </div>
                    `;
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                        <div class="cart-item">
                            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                            <div class="cart-item-details">
                                <h6 class="cart-item-title">${item.name}</h6>
                                <span class="cart-item-price">${formatter.format(item.price)}</span>
                                <div class="cart-item-actions mt-2">
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn-qty" onclick="changeQty('${item.id}', -1)">-</button>
                                        <span class="px-2 border-top border-bottom d-flex align-items-center">${item.qty}</span>
                                        <button class="btn-qty" onclick="changeQty('${item.id}', 1)">+</button>
                                    </div>
                                    <button class="btn-remove ms-auto" onclick="removeFromCart('${item.id}')" title="Eliminar">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('');
        }
    }

    function showAddedFeedback() {
        const offcanvasElement = document.getElementById('cartOffcanvas');
        const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
        bsOffcanvas.show();
    }

    cartButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const product = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseInt(this.dataset.price),
                img: this.dataset.img
            };
            addToCart(product);

            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            this.classList.add('btn-success');
            this.classList.remove('btn-alma-primary');

            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('btn-success');
                this.classList.add('btn-alma-primary');
            }, 1500);
        });
    });

});