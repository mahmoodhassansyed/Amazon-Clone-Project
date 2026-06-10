//How to upload to githb:
/*
cd /home/mahmoodhassansyed/Web\ Development/javascript-amazon-project
git push origin main
*/
import { cart } from '../data/cart.js';
import { products } from '../data/products.js';
import { searchProducts } from './utils.js';

// Reset local storage if needed (for development)
// sessionStorage.clear();

export function updateCartQuantity() {
    let cartQuantity = 0;

    for (let i = 0; i < cart.length; i++) {
        cartQuantity += cart[i].quantity;
    }

    // Update cart quantity on all pages that have this element
    const cartQuantityElement1 = document.querySelector('.js-cart-quantity');
    const cartQuantityElement2 = document.querySelector(
        '.js-return-to-home-link'
    );
    const cartQuantityElement3 = document.querySelector(
        '.js-orders-cart-quantity'
    );

    if (cartQuantityElement1) {
        cartQuantityElement1.innerHTML = cartQuantity;
    }
    if (cartQuantityElement2) {
        cartQuantityElement2.innerHTML = cartQuantity + ' Items';
    }
    if (cartQuantityElement3) {
        cartQuantityElement3.innerHTML = cartQuantity;
    }

    return cartQuantity;
}
updateCartQuantity();

function renderProducts(productsToRender = products) {
    let productsHTML = '';

    productsToRender.forEach((product) => {
        productsHTML += `
<div class="product-container">
  <div class="product-image-container">
    <img class="product-image" src="${product.image}" alt="${product.name}" />
  </div>

  <div class="product-name limit-text-to-2-lines">${product.name}</div>

  <div class="product-rating-container">
    <img
      class="product-rating-stars"
      src="images/ratings/rating-${product.rating.stars * 10}.png"
      alt="Rating ${product.rating.stars} out of 5"
    />
    <div class="product-rating-count link-primary">${product.rating.count}</div>
  </div>

  <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>

  <div class="product-quantity-container">
    <select class="js-product-quantity-value">
      <option selected value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
  </div>

  <div class="product-spacer"></div>

  <button
    class="add-to-cart-button button-primary"
    data-product-id="${product.id}"
  >
    Add to Cart
  </button>
</div>
`;
    });

    const gridElement = document.querySelector('.js-products-grid');
    if (gridElement) {
        gridElement.innerHTML = productsHTML;
    }

    // Add event listeners for all Add to Cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-button');
    addToCartBtns.forEach((addToCartBtn) => {
        addToCartBtn.addEventListener('click', (event) => {
            addToCartLogic(event);
        });
    });
}
renderProducts();

function addToCartLogic(event) {
    const addToCartBtn = event.currentTarget;
    const productId = addToCartBtn.dataset.productId;

    const quantityValue = Number(
        addToCartBtn.parentNode.querySelector('.js-product-quantity-value')
            .value
    );

    const selectedProduct = products.find(
        (product) => product.id === productId
    );
    if (!selectedProduct) {
        console.error('Product not found!');
        return;
    }

    // Check if product is already in cart
    let isItemInCart = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === selectedProduct.id) {
            isItemInCart = true;
            cart[i].quantity += quantityValue;
            break;
        }
    }

    // Add new item if not in cart
    if (!isItemInCart) {
        const newCartItem = {
            productId: selectedProduct.id,
            quantity: quantityValue,
            deliveryDate: deliveryDateRandomizer(),
        };
        cart.push(newCartItem);
    }

    // Save cart to storage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Update display
    updateCartQuantity();
}

// Implement search functionality
function setupSearch() {
    const searchBars = document.querySelectorAll('.search-bar');
    const searchButtons = document.querySelectorAll('.search-button');

    searchBars.forEach((searchBar, index) => {
        // Search on button click
        if (searchButtons[index]) {
            searchButtons[index].addEventListener('click', () => {
                performSearch(searchBar.value);
            });
        }

        // Search on Enter key
        searchBar.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch(searchBar.value);
            }
        });
    });
}

function performSearch(query) {
    const filteredProducts = searchProducts(products, query);
    renderProducts(filteredProducts);

    // Only show message if we're on the main products page
    if (document.querySelector('.js-products-grid')) {
        if (filteredProducts.length === 0) {
            const gridElement = document.querySelector('.js-products-grid');
            gridElement.innerHTML =
                '<div style="grid-column: 1/-1; text-align: center; padding: 40px; font-size: 18px; color: #888;">No products found. Try a different search.</div>';
        }
    }
}

setupSearch();

function deliveryDateRandomizer() {
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
