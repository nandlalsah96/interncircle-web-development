// ================================
// PRODUCTS
// ================================

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "Premium wireless headphones",
        price: 1499,
        icon: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        description: "Modern fitness smart watch",
        price: 2999,
        icon: "⌚"
    },
    {
        id: 3,
        name: "Gaming Mouse",
        description: "High precision gaming mouse",
        price: 899,
        icon: "🖱️"
    },
    {
        id: 4,
        name: "Mechanical Keyboard",
        description: "RGB mechanical keyboard",
        price: 2499,
        icon: "⌨️"
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        description: "Portable powerful speaker",
        price: 1799,
        icon: "🔊"
    },
    {
        id: 6,
        name: "Laptop Stand",
        description: "Adjustable aluminium stand",
        price: 999,
        icon: "💻"
    }
];


// ================================
// CART
// ================================

let cart = [];


// ================================
// DOM ELEMENTS
// ================================

const productContainer = document.getElementById("productContainer");

const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");

const cartModal = document.getElementById("cartModal");
const checkoutModal = document.getElementById("checkoutModal");
const successModal = document.getElementById("successModal");

const closeCart = document.getElementById("closeCart");
const closeCheckout = document.getElementById("closeCheckout");
const closeSuccess = document.getElementById("closeSuccess");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");

const checkoutBtn = document.getElementById("checkoutBtn");
const placeOrderBtn = document.getElementById("placeOrderBtn");

const continueShopping = document.getElementById("continueShopping");
const successContinue = document.getElementById("successContinue");


// ================================
// DISPLAY PRODUCTS
// ================================

function displayProducts() {

    productContainer.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                ${product.icon}
            </div>

            <div class="product-info">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="price">
                    ₹${product.price.toLocaleString("en-IN")}
                </div>

                <button
                    class="add-btn"
                    onclick="addToCart(${product.id})">
                    Add to Cart
                </button>

            </div>
        `;

        productContainer.appendChild(card);

    });
}


// ================================
// ADD TO CART
// ================================

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

}


// ================================
// UPDATE CART
// ================================

function updateCart() {

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;

    displayCart();

}


// ================================
// DISPLAY CART
// ================================

function displayCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p style="
                text-align:center;
                color:#888;
                padding:30px;
            ">
                Your cart is empty.
            </p>
        `;

        cartTotal.textContent = "0";

        return;
    }


    cart.forEach(item => {

        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `

            <div class="cart-item-info">

                <div class="cart-item-icon">
                    ${item.icon}
                </div>

                <div>

                    <h4>${item.name}</h4>

                    <small>
                        ₹${item.price.toLocaleString("en-IN")}
                        × ${item.quantity}
                    </small>

                </div>

            </div>

            <button
                class="remove-btn"
                onclick="removeFromCart(${item.id})">
                Remove
            </button>

        `;

        cartItems.appendChild(div);

    });


    cartTotal.textContent =
        calculateTotal().toLocaleString("en-IN");

}


// ================================
// REMOVE FROM CART
// ================================

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    updateCart();

}


// ================================
// CALCULATE TOTAL
// ================================

function calculateTotal() {

    return cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

}


// ================================
// OPEN CART
// ================================

cartBtn.addEventListener("click", () => {

    cartModal.classList.add("active");

});


// ================================
// CLOSE CART
// ================================

closeCart.addEventListener("click", () => {

    cartModal.classList.remove("active");

});


// ================================
// CHECKOUT
// ================================

checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    cartModal.classList.remove("active");

    displayCheckout();

    checkoutModal.classList.add("active");

});


// ================================
// DISPLAY CHECKOUT
// ================================

function displayCheckout() {

    checkoutItems.innerHTML = "";

    cart.forEach(item => {

        const div = document.createElement("div");

        div.className = "checkout-item";

        const itemTotal =
            item.price * item.quantity;

        div.innerHTML = `

            <span>
                ${item.name}
                × ${item.quantity}
            </span>

            <strong>
                ₹${itemTotal.toLocaleString("en-IN")}
            </strong>

        `;

        checkoutItems.appendChild(div);

    });


    checkoutTotal.textContent =
        calculateTotal().toLocaleString("en-IN");

}


// ================================
// CLOSE CHECKOUT
// ================================

closeCheckout.addEventListener("click", () => {

    checkoutModal.classList.remove("active");

});


// ================================
// CONTINUE SHOPPING
// ================================

continueShopping.addEventListener("click", () => {

    checkoutModal.classList.remove("active");

});


// ================================
// PLACE ORDER
// ================================

placeOrderBtn.addEventListener("click", () => {

    checkoutModal.classList.remove("active");

    successModal.classList.add("active");

    // Clear cart
    cart = [];

    updateCart();

});


// ================================
// CLOSE SUCCESS
// ================================

closeSuccess.addEventListener("click", () => {

    successModal.classList.remove("active");

});


// ================================
// SUCCESS → CONTINUE SHOPPING
// ================================

successContinue.addEventListener("click", () => {

    successModal.classList.remove("active");

});


// ================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ================================

window.addEventListener("click", (event) => {

    if (event.target === cartModal) {

        cartModal.classList.remove("active");

    }

    if (event.target === checkoutModal) {

        checkoutModal.classList.remove("active");

    }

    if (event.target === successModal) {

        successModal.classList.remove("active");

    }

});


// ================================
// ESC KEY CLOSE
// ================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        cartModal.classList.remove("active");

        checkoutModal.classList.remove("active");

        successModal.classList.remove("active");

    }

});


// ================================
// INITIAL LOAD
// ================================

displayProducts();
updateCart();