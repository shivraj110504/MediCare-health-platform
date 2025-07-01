let cart = [];
let total = 40; // Starting with delivery fee

function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1,
            image: image
        });
    }
    
    updateCartDisplay();
    showToast('Item added to cart');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
    showToast('Item removed from cart');
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    const cartItems = document.getElementById('cartItems');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const totalAmount = document.getElementById('totalAmount');
    
    if (cart.length === 0) {
        cartContent.classList.add('hidden');
        emptyCart.classList.remove('hidden');
        return;
    }
    
    cartContent.classList.remove('hidden');
    emptyCart.classList.add('hidden');
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    total = subtotal + 40; // Adding delivery fee
    
    // Update amounts
    subtotalAmount.textContent = `₹${subtotal}`;
    totalAmount.textContent = `₹${total}`;
    
    // Update cart items display
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item flex items-center justify-between p-2 rounded">
            <div class="flex items-center">
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded mr-3">
                <div>
                    <h4 class="text-sm font-medium text-white">${item.name}</h4>
                    <p class="text-xs text-gray-400">₹${item.price} × ${item.quantity}</p>
                </div>
            </div>
            <div class="flex items-center">
                <button onclick="updateQuantity('${item.id}', -1)" class="text-gray-400 hover:text-white p-1">
                    <i data-lucide="minus-circle"></i>
                </button>
                <span class="mx-2 text-white">${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', 1)" class="text-gray-400 hover:text-white p-1">
                    <i data-lucide="plus-circle"></i>
                </button>
                <button onclick="removeFromCart('${item.id}')" class="text-red-400 hover:text-red-600 ml-2 p-1">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Refresh Lucide icons
    lucide.createIcons();
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});
