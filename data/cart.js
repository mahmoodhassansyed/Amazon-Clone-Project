const savedCart = JSON.parse(sessionStorage.getItem('cart'));

export let cart = savedCart || [];
