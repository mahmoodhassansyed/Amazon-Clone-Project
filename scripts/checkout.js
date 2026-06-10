import { cart } from '../data/cart.js';
import { products } from '../data/products.js';
import { orders } from '../data/orders.js';
import { updateCartQuantity } from './amazon.js';
import {
    generateOrderId,
    getDeliveryOptions,
    formatDeliveryDate,
} from './utils.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

// Store delivery option prices for later use
const deliveryOptionPrices = {
    'delivery-option-1': 0,
    'delivery-option-2': 499,
    'delivery-option-3': 999,
};

function renderPaymentSummary() {
    let items = updateCartQuantity();

    let shipping;
    items === 0 ? (shipping = 0) : (shipping = 499);

    function calculateCostTotalNoTax() {
        if (items === 0) return 0;

        let totalPriceCents = 0;
        let productsMap = {};

        for (let i = 0; i < products.length; i++) {
            productsMap[products[i].id] = products[i];
        }

        for (let i = 0; i < cart.length; i++) {
            const cartItem = cart[i];
            const product = productsMap[cartItem.productId];

            if (product) {
                totalPriceCents += product.priceCents * cartItem.quantity;
            }
        }
        return totalPriceCents;
    }

    let productCostCents = calculateCostTotalNoTax();
    let costTotalNoTax = productCostCents + shipping;

    let tax = costTotalNoTax / 10;
    let costTotal = costTotalNoTax + tax;

    let paymentSummaryHTML = `
          <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (${items}):</div>
            <div class="payment-summary-money">$${(productCostCents / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${(shipping / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${(costTotalNoTax / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${(tax / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${(costTotal / 100).toFixed(2)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
  `;

    const paymentSummaryElement = document.querySelector('.js-payment-summary');

    if (paymentSummaryElement) {
        paymentSummaryElement.innerHTML = paymentSummaryHTML;

        const placeOrderBtn = paymentSummaryElement.querySelector(
            '.place-order-button'
        );

        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', (event) => {
                placeOrderLogic(event);
            });
        }
    }
}
renderPaymentSummary();

function placeOrderLogic(event) {
    if (cart.length === 0) {
        renderPaymentSummary();
        return;
    }
    let temp = [];
    let costTotalNoTax = 0;

    cart.forEach((cartItem) => {
        const product = products.find((p) => p.id === cartItem.productId);
        if (product) {
            temp.push({
                dateArrival: cartItem.deliveryDate || 'No date',
                image: product.image || '',
                name: product.name || 'Unknown Item',
                quantity: cartItem.quantity || 0,
            });
            costTotalNoTax += product.priceCents * cartItem.quantity;
        }
    });

    let shipping = cart.length === 0 ? 0 : 499;
    let costTotalNoTaxWithShipping = costTotalNoTax + shipping;
    let tax = costTotalNoTaxWithShipping / 10;
    let costTotal = costTotalNoTaxWithShipping + tax;

    // Generate unique order ID
    const orderItem = {
        orderHeader: {
            dateOrdered: new Date().toJSON().slice(0, 10),
            total: Number((costTotal / 100).toFixed(2)),
            orderId: generateOrderId(),
        },
        orderDetails: temp,
    };
    orders.push(orderItem);

    sessionStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    cart.length = 0;
    sessionStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    renderPaymentSummary();
    updateCartQuantity();

    // Show success message
    alert(
        'Order placed successfully! Order ID: ' + orderItem.orderHeader.orderId
    );
}

function renderCartItems() {
    let cartItemsHTML = '';
    const deliveryOptions = getDeliveryOptions();

    cart.forEach((cartItem) => {
        const selectedProduct = products.find(
            (product) => product.id === cartItem.productId
        );

        if (!selectedProduct) return;

        cartItemsHTML += `
        <div class="cart-item-container">
            <div class="delivery-date">Delivery date: ${cartItem.deliveryDate}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${selectedProduct.image}"
                alt="${selectedProduct.name}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${selectedProduct.name}
                </div>
                <div class="product-price">$${(selectedProduct.priceCents / 100).toFixed(2)}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label">${cartItem.quantity}</span> </span>
                  <span class="update-quantity-link update-quantity-link-js link-primary"
                  data-product-id="${selectedProduct.id}">
                    Update
                  </span>
                  <span
                  class="delete-quantity-link delete-quantity-link-js link-primary"
                  data-product-id="${selectedProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptions
                    .map(
                        (option, index) => `
                <div class="delivery-option">
                  <input
                    type="radio"
                    ${index === 0 ? 'checked' : ''}
                    class="delivery-option-input js-delivery-option"
                    name="delivery-option-${selectedProduct.id}"
                    data-product-id="${selectedProduct.id}"
                    data-delivery-date="${option.date}"
                  />
                  <div>
                    <div class="delivery-option-date">${option.date}</div>
                    <div class="delivery-option-price">${option.label}</div>
                  </div>
                </div>
                `
                    )
                    .join('')}
              </div>
            </div>
          </div>
          `;
    });

    const orderSummary = document.querySelector('.order-summary');

    if (orderSummary) {
        orderSummary.innerHTML = cartItemsHTML;

        // Setup delivery option listeners
        const deliveryOptions = orderSummary.querySelectorAll(
            '.js-delivery-option'
        );
        deliveryOptions.forEach((option) => {
            option.addEventListener('change', (event) => {
                const productId = event.target.dataset.productId;
                const newDeliveryDate = event.target.dataset.deliveryDate;

                const cartItem = cart.find(
                    (item) => item.productId === productId
                );
                if (cartItem) {
                    cartItem.deliveryDate = newDeliveryDate;
                    sessionStorage.setItem('cart', JSON.stringify(cart));
                    renderPaymentSummary();
                }
            });
        });

        // Setup delete buttons
        let deleteButtons = orderSummary.querySelectorAll(
            '.delete-quantity-link-js'
        );
        deleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener('click', (event) => {
                deleteButtonLogic(event);
            });
        });

        // Setup update buttons
        let updateButtons = orderSummary.querySelectorAll(
            '.update-quantity-link'
        );
        updateButtons.forEach((updateButton) => {
            updateButton.addEventListener('click', (event) => {
                updateButtonLogic(event);
            });
        });
    }
}
renderCartItems();

function deleteButtonLogic(event) {
    const deleteButton = event.target;
    const productId = deleteButton.dataset.productId;

    let tempCart = [];

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId !== productId) {
            tempCart.push(cart[i]);
        }
    }

    cart.length = 0;
    cart.push(...tempCart);

    updateCartQuantity();
    renderCartItems();
    renderPaymentSummary();

    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function updateButtonLogic(event) {
    let userInput;

    const productId = event.currentTarget.dataset.productId;

    while (true) {
        let input = prompt('Please enter a number between 1 and 1000:');

        if (input === null) {
            return null;
        }

        userInput = Number(input);

        if (!isNaN(userInput) && input.trim() !== '') {
            if (userInput > 1000 || userInput <= 0) {
                alert(
                    'You cannot order ' +
                        userInput +
                        ' of these. Please try again.'
                );
            } else {
                const cartItem = cart.find(
                    (item) => item.productId === productId
                );

                if (cartItem) {
                    cartItem.quantity = userInput;
                    updateCartQuantity();
                    renderCartItems();
                    renderPaymentSummary();
                    sessionStorage.setItem('cart', JSON.stringify(cart));
                }

                return;
            }
        } else {
            alert('Invalid Input! Please enter a number.');
        }
    }
}
