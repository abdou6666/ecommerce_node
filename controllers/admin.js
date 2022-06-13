const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		edit: false
	});
};

exports.postAddProduct = async (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	// method 1
	// await Product.create({
	// 	title,
	// 	price,
	// 	imageUrl,
	// 	description,
	// 	userId: req.user.id
	// });

	// method 2
	await req.user.createProduct({
		title,
		price,
		imageUrl,
		description,
		userId: req.user.id
	});
	res.redirect('/admin/products');
};

exports.getEditProduct = async (req, res, next) => {
	const editMode = req.query.edit;
	const prodId = req.params.productId;
	if (!editMode) {
		return res.redirect('/');
	}
	if (!prodId) {
		return res.redirect('/');
	}
	const product = await req.user.getProducts({ where: { id: prodId } });
	//const product = await Product.findByPk(prodId);
	return res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/edit-product',
		edit: editMode,
		product: product[0]
	});
};

exports.postEditProduct = async (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrL;
	const updatedDescription = req.body.description;

	const product = await Product.findByPk(prodId);
	product.title = updatedTitle;
	product.price = updatedPrice;
	product.imageUrL = updatedImageUrl;
	product.description = updatedDescription;
	await product.save();

	res.redirect('/admin/products');
};
exports.postDeleteProduct = async (req, res, next) => {
	const productId = req.body.productId;
	await Product.destroy({
		where: {
			id: productId
		}
	});

	res.redirect('/admin/products');
};
exports.getProducts = async (req, res, next) => {
	const products = await req.user.getProducts();
	res.render('admin/products', {
		prods: products,
		pageTitle: 'Admin Products',
		path: '/admin/products'
	});
};
