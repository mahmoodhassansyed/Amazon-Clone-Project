# Amazon E-Commerce Clone

A fully functional e-commerce web application built with **vanilla JavaScript, HTML, and CSS**. This project recreates core Amazon functionality including product browsing, shopping cart management, checkout, and order tracking.

**Version: 1.0.1**

## Features:

### Core Functionality:-

- **Product Browsing**: Display of 20+ products with ratings, prices, and images
- **Search**: Filter products by name and keywords across all pages
- **Shopping Cart**: Add, update, or remove items with real-time updates
- **Checkout**: Complete order review with payment summary
- **Order History**: View all placed orders with complete details
- **Order Tracking**: Track individual orders with delivery status
- **Buy Again**: Quick reorder from previous purchases
- **Delivery Options**: Select shipping speeds for each item
- **Splash Screen**: Professional intro screen on first session
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Technologies Used:

- **Frontend**: Vanilla JavaScript (ES6 Modules), HTML5, CSS3
- **State Management**: Browser SessionStorage for persistent cart and orders
- **External Libraries**: Day.js (via CDN) for date formatting
- **Architecture**: Modular JavaScript with separated concerns
- **Deployment**: Vercel (with static hosting)

## Project Structure:

```
amazon-ecommerce-clone/
├── index.html              Main products page (entry point)
├── checkout.html           Cart and checkout page
├── orders.html             Order history page
├── tracking.html           Order tracking page
├── vercel.json             Vercel deployment configuration
│
├── scripts/
│   ├── amazon.js           Product browsing logic
│   ├── checkout.js         Cart and checkout functionality
│   ├── ordersPage.js       Order history page logic
│   ├── tracking.js         Order tracking page logic
│   ├── utils.js            Shared utility functions
│   └── splash.js           Splash screen animation
│
├── data/
│   ├── products.js         Product catalog data
│   ├── cart.js             Shopping cart state
│   └── orders.js           Orders state management
│
├── styles/
│   ├── shared/
│   │   ├── general.css     Global styles and resets
│   │   ├── amazon-header.css Navigation header styles
│   │   └── splash.css      Splash screen animations
│   └── pages/
│       ├── amazon.css      Products page styles
│       ├── orders.css      Orders page styles
│       ├── tracking.css    Tracking page styles
│       └── checkout/
│           ├── checkout.css
│           └── checkout-header.css
│
├── images/                 Product and icon images
├── backend/                Product data backup
├── package.json            Project metadata and scripts
├── .gitignore              Git ignore configuration
└── README.md               This file
```

## How to Use:

### Browsing Products

1. Open the application on the home page
2. View all available products with ratings and prices
3. Use the search bar to find specific products

### Adding to Cart

1. Click the "Add to Cart" button on any product
2. View your cart by clicking the "Cart" link in the header
3. The cart count updates in real-time

### Checkout

1. Navigate to the checkout page from the header
2. Review all items in your cart
3. Select delivery options for each item
4. Click "Place Your Order" to complete purchase

### Order History

1. Click "Returns & Orders" in the header
2. View all your past orders
3. Click any order to track it
4. Use "Buy Again" to quickly reorder

### Order Tracking

1. Click on any order from the Orders page
2. View delivery status and estimated delivery date
3. Modify delivery options if needed
4. Return to products page or view all orders

## State Management:

The application uses **SessionStorage API** to persist:

- Shopping cart items
- Order history
- Delivery preferences
- Splash screen view status

Data persists during your browser session and clears when you close all tabs.

## Features Highlight:

- **Modular Architecture**: Each page has its own JavaScript module for clean code
- **Responsive Design**: Mobile-first CSS approach with media queries
- **Real-time Updates**: Cart updates instantly across all pages
- **Professional UI**: Amazon-inspired design system
- **Splash Screen**: Memorable first-time user experience
- **Date Formatting**: Uses Day.js for consistent date display

## Browser Support:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Changelog

Version 1.0.1: Place order button takes to orders.html page instead of showing you a blank checkout.html page.

## 📄 License

MIT License - feel free to use this project for learning and personal projects.

## 👨‍💻 Author

**Syed Mahmood Hassan**

- GitHub: https://github.com/mahmoodhassansyed
- Project Repository: https://github.com/mahmoodhassansyed/amazon-clone-project
