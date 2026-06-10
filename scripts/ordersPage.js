import { orders } from '../data/orders.js';
import { cart } from '../data/cart.js';
import { products } from '../data/products.js';
import { updateCartQuantity } from './amazon.js';

function renderOrderItems() {
    let orderItemsHTML = '';

    orders.forEach((orderItem, orderIndex) => {
        orderItemsHTML += `
<div class="order-container">
  <div class="order-header">
    <div class="order-header-left-section">
      <div class="order-date">
        <div class="order-header-label">Order Placed:</div>
        <div>${orderItem.orderHeader.dateOrdered}</div>
      </div>
      <div class="order-total">
        <div class="order-header-label">Total:</div>
        <div>$${orderItem.orderHeader.total}</div>
      </div>
    </div>

    <div class="order-header-right-section">
      <div class="order-header-label">Order ID:</div>
      <div>${orderItem.orderHeader.orderId}</div>
    </div>
  </div>

  <div class="order-details-grid">
    ${orderItem.orderDetails
        .map(
            (orderProduct, productIndex) => `
      <div class="product-image-container">
        <img src="${orderProduct.image}" alt="${orderProduct.name}" />
      </div>

      <div class="product-details">
        <div class="product-name">${orderProduct.name}</div>
        <div class="product-delivery-date">${orderProduct.dateArrival}</div>
        <div class="product-quantity">Quantity: ${orderProduct.quantity}</div>
        <button class="buy-again-button button-primary js-buy-again-button" data-order-index="${orderIndex}" data-product-index="${productIndex}">
          <img class="buy-again-icon" src="images/icons/buy-again.png" alt="Buy again icon" />
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <button class="track-package-button button-secondary js-track-package-button" data-order-index="${orderIndex}">
          Track package
        </button>
      </div>
    `
        )
        .join('')}
  </div>
</div>
    `;
    });

    const ordersGrid = document.querySelector('.orders-grid');

    if (ordersGrid) {
        ordersGrid.innerHTML = orderItemsHTML;

        // Setup "Buy Again" button listeners
        const buyAgainButtons = ordersGrid.querySelectorAll(
            '.js-buy-again-button'
        );
        buyAgainButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                buyAgainLogic(event);
            });
        });

        // Setup "Track Package" button listeners
        const trackButtons = ordersGrid.querySelectorAll(
            '.js-track-package-button'
        );
        trackButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                trackPackageLogic(event);
            });
        });
    }
}

function buyAgainLogic(event) {
    const button = event.currentTarget;
    const orderIndex = parseInt(button.dataset.orderIndex);
    const productIndex = parseInt(button.dataset.productIndex);

    const order = orders[orderIndex];
    if (!order) return;

    const orderProduct = order.orderDetails[productIndex];
    if (!orderProduct) return;

    // Find the product in the products array
    const product = products.find((p) => p.name === orderProduct.name);
    if (!product) {
        alert('Product not found in catalog');
        return;
    }

    // Check if product is already in cart
    let isItemInCart = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === product.id) {
            isItemInCart = true;
            cart[i].quantity += orderProduct.quantity;
            break;
        }
    }

    // Add product to cart if not already there
    if (!isItemInCart) {
        // Generate a new delivery date (randomizer)
        const deliveryDate = generateDeliveryDate();
        const newCartItem = {
            productId: product.id,
            quantity: orderProduct.quantity,
            deliveryDate: deliveryDate,
        };
        cart.push(newCartItem);
    }

    // Save cart to sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Update cart quantity display
    updateCartQuantity();

    // Show success message
    alert(
        `${orderProduct.name} (Quantity: ${orderProduct.quantity}) added to cart!`
    );
}

function trackPackageLogic(event) {
    const button = event.currentTarget;
    const orderIndex = parseInt(button.dataset.orderIndex);

    // Store the order index in sessionStorage so tracking page can access it
    sessionStorage.setItem('selectedOrderIndex', orderIndex);

    // Navigate to tracking page
    window.location.href = 'tracking.html';
}

function generateDeliveryDate() {
    const today = new Date();
    const currentYear = today.getFullYear();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    if (tomorrow > endOfYear) {
        endOfYear.setFullYear(currentYear + 1);
    }

    const randomTime =
        tomorrow.getTime() +
        Math.random() * (endOfYear.getTime() - tomorrow.getTime());
    const randomDate = new Date(randomTime);

    const monthName = randomDate.toLocaleString('en-US', { month: 'long' });
    const date = randomDate.getDate();
    const day = randomDate.toLocaleString('en-US', { weekday: 'long' });

    return `${monthName} ${date}, ${day}`;
}

updateCartQuantity();
renderOrderItems();
