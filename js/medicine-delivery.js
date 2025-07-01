// Cart functionality
let cart = [];
const deliveryFee = 40;

function addToCart(id, name, price, image) {
    const item = {
        id,
        name,
        price,
        image,
        quantity: 1
    };

    const existingItem = cart.find(i => i.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(item);
    }

    updateCartUI();
    showToast('Item added to cart');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    showToast('Item removed from cart');
}

function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        updateCartUI();
    }
}

function updateCartUI() {
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

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item p-3 border-b border-gray-700">
            <div class="flex justify-between items-center">
                <div class="flex-1">
                    <h4 class="text-white font-medium">${item.name}</h4>
                    <div class="text-gray-400">₹${item.price} × ${item.quantity}</div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="updateQuantity('${item.id}', -1)" class="text-gray-400 hover:text-white">-</button>
                    <span class="text-white">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" class="text-gray-400 hover:text-white">+</button>
                    <button onclick="removeFromCart('${item.id}')" class="text-red-400 hover:text-red-300 ml-2">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee;

    subtotalAmount.textContent = `₹${subtotal}`;
    totalAmount.textContent = `₹${total}`;

    // Update Lucide icons
    lucide.createIcons();
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 p-4 rounded-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('medicineOrderForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (cart.length === 0) {
                showToast('Please add items to your cart first', 'error');
                return;
            }

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                specialInstructions: document.getElementById('specialInstructions').value,
                deliveryTime: document.getElementById('deliveryTime').value,
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                deliveryFee,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + deliveryFee
            };

            try {
                const response = await fetch('/api/medicine-orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                
                if (response.ok) {
                    showToast('Order placed successfully!');
                    cart = [];
                    updateCartUI();
                    form.reset();
                } else {
                    showToast(data.message || 'Error placing order', 'error');
                }
            } catch (error) {
                showToast('Error submitting order. Please try again.', 'error');
                console.error('Order submission error:', error);
            }
        });
    }

    // Initialize cart UI
    updateCartUI();
});