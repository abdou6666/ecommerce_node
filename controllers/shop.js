const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
	const data = await Product.findAll();
	res.render('shop/product-list', {
		prods: data,
		pageTitle: 'All Products',
		path: '/products'
	});
};

exports.getProduct = async (req, res, next) => {
	const productId = req.params.productId;

	const product = await Product.findByPk(productId);

	res.render('shop/product-detail', {
		product: product.dataValues,
		pageTitle: product.dataValues.title,
		path: '/products'
	});
};
exports.getIndex = async (req, res, next) => {
	const data = await Product.findAll();
	res.render('shop/index', {
		prods: data,
		pageTitle: 'Shop',
		path: '/'
	});
};

exports.getCart = async (req, res, next) => {
	const cart = await req.user.getCart();
	const products = await cart.getProducts();

	res.render('shop/cart', {
		path: '/cart',
		pageTitle: 'Your Cart',
		products
	});
};

exports.getOrders = async (req, res, next) => {
	const orders = await req.user.getOrders({ include: [ 'products' ] });
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders',
		orders
	});
};

exports.postOrder = async (req, res, next) => {
	const cart = await req.user.getCart();
	const products = await cart.getProducts();
	const order = await req.user.createOrder();
	await order.addProducts(
		products.map((product) => {
			product.orderItem = { quantity: product.cartItem.qty };
			return product;
		})
	);
	await cart.setProducts(null);
	res.redirect('/orders');
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
};

exports.postCart = async (req, res, next) => {
	const productId = req.body.productId;
	const cart = await req.user.getCart();
	const products = await cart.getProducts({ where: { id: productId } });
	let product;
	let newQuantity = 1;

	// product id is correct

	if (products.length > 0) {
		product = products[0];
	}
	// product exist in cart

	if (product) {
		const oldQty = product.cartItem.qty;
		newQuantity = oldQty + 1;
		await cart.addProduct(product, { through: { qty: newQuantity } });
		return res.redirect('/cart');
	}

	// product doesn't exist in the cart yet

	product = await Product.findByPk(productId);
	await cart.addProduct(product, { through: { qty: newQuantity } });
	return res.redirect('/cart');
};

exports.postDeleteCartItem = async (req, res, next) => {
	const prodId = req.body.productId;
	const cart = await req.user.getCart();
	const products = await cart.getProducts({ where: { id: prodId } });
	const product = products[0];
	await product.cartItem.destroy();
	res.redirect('/cart');
};
