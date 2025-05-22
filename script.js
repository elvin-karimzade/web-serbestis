
const products = [
    {
        id: 1,
        name: "Chanel No. 5",
        brand: "Chanel",
        category: "women",
        price: 450,
        oldPrice: 500,
        discount: 10,
        rating: 4.8,
        image: "/api/placeholder/280/250",
        description: "Klassik qadın ətri"
    },
    {
        id: 2,
        name: "Dior Sauvage",
        brand: "Dior",
        category: "men",
        price: 380,
        oldPrice: 420,
        discount: 10,
        rating: 4.7,
        image: "/api/placeholder/280/250",
        description: "Güclü kişi ətri"
    },
    {
        id: 3,
        name: "Tom Ford Black Orchid",
        brand: "Tom Ford",
        category: "unisex",
        price: 650,
        oldPrice: 700,
        discount: 7,
        rating: 4.9,
        image: "/api/placeholder/280/250",
        description: "Lüks uniseks ətir"
    },
    {
        id: 4,
        name: "Versace Bright Crystal",
        brand: "Versace",
        category: "women",
        price: 320,
        oldPrice: 360,
        discount: 11,
        rating: 4.6,
        image: "/api/placeholder/280/250",
        description: "Yaz üçün ideal"
    },
    {
        id: 5,
        name: "Hugo Boss",
        brand: "Hugo Boss",
        category: "men",
        price: 280,
        oldPrice: 320,
        discount: 13,
        rating: 4.5,
        image: "/api/placeholder/280/250",
        description: "İş üçün mükəmməl"
    },
    {
        id: 6,
        name: "Creed Aventus",
        brand: "Creed",
        category: "luxury",
        price: 890,
        oldPrice: 950,
        discount: 6,
        rating: 4.9,
        image: "/api/placeholder/280/250",
        description: "Premium ətir"
    },
    {
        id: 7,
        name: "Gucci Flora",
        brand: "Gucci",
        category: "women",
        price: 420,
        oldPrice: 450,
        discount: 7,
        rating: 4.7,
        image: "/api/placeholder/280/250",
        description: "Çiçək ətri"
    },
    {
        id: 8,
        name: "Jean Paul Gaultier",
        brand: "JPG",
        category: "unisex",
        price: 340,
        oldPrice: 380,
        discount: 11,
        rating: 4.6,
        image: "/api/placeholder/280/250",
        description: "Unikal dizayn"
    }
];

// Cart functionality
let cart = [];
let favorites = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
});

// Load products
function loadProducts(category = 'all') {
    showLoading();
    
    setTimeout(() => {
        const productGrid = document.getElementById('productGrid');
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);

        productGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
                    <button class="favorite-btn ${favorites.includes(product.id) ? 'active' : ''}" 
                        onclick="toggleFavorite(${product.id})">
                        ${favorites.includes(product.id) ? '❤️' : '🤍'}
                    </button>
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.brand}</div>
                    <div class="product-name">${product.name}</div>
                    <div class="rating">
                        <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                        <span class="rating-text">(${product.rating})</span>
                    </div>
                    <div class="price-container">
                        <span class="current-price">${product.price}₼</span>
                        ${product.oldPrice ? `<span class="old-price">${product.oldPrice}₼</span>` : ''}
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        Səbətə Əlavə Et
                    </button>
                </div>
            </div>
        `).join('');

        hideLoading();
    }, 500);
}

// Show/hide loading
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('productGrid').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('productGrid').style.display = 'grid';
}

// Filter products
function filterProducts(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    loadProducts(category);
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const productBrand = card.querySelector('.product-brand').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productBrand.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }

    updateCartCount();
    updateCartDisplay();
    
    // Success animation
    event.target.textContent = 'Əlavə Edildi!';
    event.target.style.background = '#4caf50';
    setTimeout(() => {
        event.target.textContent = 'Səbətə Əlavə Et';
        event.target.style.background = '#667eea';
    }, 1000);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            updateCartDisplay();
        }
    }
}

// Toggle favorite
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(productId);
    }
    
    // Update UI
    const favoriteBtn = event.target;
    favoriteBtn.textContent = favorites.includes(productId) ? '❤️' : '🤍';
    favoriteBtn.classList.toggle('active');
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        updateCartDisplay();
    }
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">Səbət boşdur</div>';
        cartTotal.textContent = 'Cəmi: 0₼';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price}₼</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span style="margin: 0 1rem;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 1rem; background: #ff6b6b; color: white;">×</button>
                </div>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Cəmi: ${total}₼`;
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Səbət boşdur!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Sifarişiniz qəbul edildi! Cəmi: ${total}₼`);
    
    // Clear cart
    cart = [];
    updateCartCount();
    updateCartDisplay();
    toggleCart();
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Search on Enter key
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchProducts();
    }
});

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains('active')) {
        toggleCart();
    }
});