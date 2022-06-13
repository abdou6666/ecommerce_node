const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
	const [ rows, fieldData ] = await Product.fetchAll();
	res.render('shop/product-list', {
		prods: rows,
		pageTitle: 'All Products',
		path: '/products'
	});
};

exports.getProduct = async (req, res, next) => {
	const productId = req.params.productId;
	const [ rows ] = await Product.findById(productId);
	res.render('shop/product-detail', {
		product: rows[0],
		pageTitle: 'product.title',
		path: '/products'
	});
};
exports.getIndex = async (req, res, next) => {
	const [ rows, fieldData ] = await Product.fetchAll();
	res.render('shop/index', {
		prods: rows,
		pageTitle: 'Shop',
		path: '/'
	});
};

exports.getCart = (req, res, next) => {
	const cartProducts = [];
	Cart.getCartProducts((cart) => {
		Product.fetchAll((products) => {
			for (p of cart.products) {
				const cartProductData = products.find((prod) => prod.id === p.id);
				if (cartProductData) {
					cartProducts.push({
						productData: cartProductData,
						qty: p.qty
					});
				}
			}
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: cartProducts
			});
		});
	});
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders'
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
};

exports.postCart = (req, res, next) => {
	const productId = req.body.productId;
	const prod = Product.findById(productId, (product) => {
		Cart.addProduct(productId, product.price);
	});
	res.redirect('/cart');
};

exports.postDeleteCartItem = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.deleteProduct(prodId, product.price);
		return res.redirect('/cart');
	});
};
