const savedOrders = JSON.parse(sessionStorage.getItem('orders'));

export let orders = savedOrders || [];
