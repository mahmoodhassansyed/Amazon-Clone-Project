// Utility functions shared across the application

// Generate a unique order ID
export function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    return `order-${timestamp}-${random}`;
}

// Format price in dollars
export function formatPrice(priceCents) {
    return `$${(priceCents / 100).toFixed(2)}`;
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate() {
    const today = new Date();
    return today.toJSON().slice(0, 10);
}

// Search products by name or keywords
export function searchProducts(products, query) {
    if (!query || query.trim() === '') {
        return products;
    }

    const lowerQuery = query.toLowerCase();
    return products.filter((product) => {
        const matchesName = product.name.toLowerCase().includes(lowerQuery);
        const matchesKeywords =
            product.keywords &&
            product.keywords.some((keyword) =>
                keyword.toLowerCase().includes(lowerQuery)
            );
        return matchesName || matchesKeywords;
    });
}

// Calculate shipping cost based on item count
export function calculateShipping(itemCount) {
    return itemCount === 0 ? 0 : 499; // 0 or $4.99
}

// Calculate tax (10% of subtotal)
export function calculateTax(subtotalCents) {
    return Math.round(subtotalCents / 10);
}

// Get delivery date options (returns 3 options)
export function getDeliveryOptions() {
    const today = new Date();

    const option1 = new Date(today);
    option1.setDate(today.getDate() + 7);

    const option2 = new Date(today);
    option2.setDate(today.getDate() + 3);

    const option3 = new Date(today);
    option3.setDate(today.getDate() + 1);

    return [
        {
            date: formatDeliveryDate(option1),
            cost: 0,
            costCents: 0,
            label: 'FREE Shipping',
        },
        {
            date: formatDeliveryDate(option2),
            cost: 4.99,
            costCents: 499,
            label: '$4.99 - Shipping',
        },
        {
            date: formatDeliveryDate(option3),
            cost: 9.99,
            costCents: 999,
            label: '$9.99 - Shipping',
        },
    ];
}

// Format date as "Day, Month Date"
export function formatDeliveryDate(dateObj) {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
}

// Calculate order status based on date (for tracking)
export function getOrderStatus(dateOrdered) {
    const ordered = new Date(dateOrdered);
    const today = new Date();
    const daysSinceOrder = Math.floor(
        (today - ordered) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceOrder < 1) {
        return 'Preparing';
    } else if (daysSinceOrder < 3) {
        return 'Shipped';
    } else {
        return 'Delivered';
    }
}
