import { orders } from '../data/orders.js';
import { products } from '../data/products.js';
import { updateCartQuantity } from './amazon.js';
import { getOrderStatus, formatDeliveryDate } from './utils.js';

function renderTracking() {
    // Get the selected order index from sessionStorage
    const selectedOrderIndex = sessionStorage.getItem('selectedOrderIndex');

    if (selectedOrderIndex === null || selectedOrderIndex === '') {
        // If no order selected, show a message and show first order or default
        if (orders.length === 0) {
            document.querySelector('.order-tracking').innerHTML = `
                <div style="padding: 40px; text-align: center; color: #666;">
                    <p>No orders to track. Start shopping!</p>
                    <a href="index.html" class="link-primary">Continue Shopping</a>
                </div>
            `;
            return;
        }
        // Default to first order if none selected
        sessionStorage.setItem('selectedOrderIndex', '0');
        renderTracking();
        return;
    }

    const orderIndex = parseInt(selectedOrderIndex);
    const order = orders[orderIndex];

    if (!order) {
        document.querySelector('.order-tracking').innerHTML = `
            <div style="padding: 40px; text-align: center; color: #666;">
                <a href="orders.html" class="link-primary">← View all orders</a>
                <p>Order not found.</p>
            </div>
        `;
        return;
    }

    // Get first product from order (for primary tracking display)
    const firstProduct = order.orderDetails[0];
    if (!firstProduct) return;

    // Calculate order status
    const orderStatus = getOrderStatus(order.orderHeader.dateOrdered);
    const statusProgressMap = {
        Preparing: 1,
        Shipped: 2,
        Delivered: 3,
    };

    const progressPercentage = (statusProgressMap[orderStatus] || 1) * 33.33;

    let trackingHTML = `
        <a class="back-to-orders-link link-primary" href="orders.html">
            View all orders
        </a>

        <div class="delivery-date">
            Arriving on ${firstProduct.dateArrival}
        </div>

        <div class="product-info">
            ${firstProduct.name}
        </div>

        <div class="product-info">
            Quantity: ${firstProduct.quantity}
        </div>

        <img class="product-image" src="${firstProduct.image}" alt="${firstProduct.name}">

        <div class="progress-labels-container">
            <div class="progress-label ${orderStatus === 'Preparing' ? 'current-status' : ''}">
                Preparing
            </div>
            <div class="progress-label ${orderStatus === 'Shipped' ? 'current-status' : ''}">
                Shipped
            </div>
            <div class="progress-label ${orderStatus === 'Delivered' ? 'current-status' : ''}">
                Delivered
            </div>
        </div>

        <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${progressPercentage}%"></div>
        </div>

        <div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 4px; font-size: 14px;">
            <strong>Order ID:</strong> ${order.orderHeader.orderId}<br>
            <strong>Order Date:</strong> ${order.orderHeader.dateOrdered}<br>
            <strong>Order Total:</strong> $${order.orderHeader.total.toFixed(2)}<br>
            <strong>Current Status:</strong> ${orderStatus}
        </div>

        ${
            order.orderDetails.length > 1
                ? `
        <div style="margin-top: 30px;">
            <h3>Other items in this order:</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px;">
                ${order.orderDetails
                    .slice(1)
                    .map(
                        (item) => `
                    <div style="text-align: center;">
                        <img src="${item.image}" alt="${item.name}" style="max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 8px;">
                        <div style="font-size: 12px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                            ${item.name}
                        </div>
                        <div style="font-size: 12px; color: #666;">Qty: ${item.quantity}</div>
                    </div>
                `
                    )
                    .join('')}
            </div>
        </div>
        `
                : ''
        }
    `;

    const orderTrackingElement = document.querySelector('.order-tracking');
    if (orderTrackingElement) {
        orderTrackingElement.innerHTML = trackingHTML;

        // Add click listener to "View all orders" link
        const backLink = orderTrackingElement.querySelector(
            '.back-to-orders-link'
        );
        if (backLink) {
            backLink.addEventListener('click', (event) => {
                event.preventDefault();
                sessionStorage.removeItem('selectedOrderIndex');
                window.location.href = 'orders.html';
            });
        }
    }
}

updateCartQuantity();
renderTracking();
