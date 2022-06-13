const express = require('express');
const sequelize = require('../util/database');
const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');
const errorController = require('../controllers/error');

const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/Cart');
const CartItem = require('../models/cart-item');

const bodyParser = require('body-parser');

const path = require('path');

async function startServer() {
	try {
		const app = express();
		app.set('view engine', 'ejs');
		app.set('views', 'views');

		// middlewares
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(express.static(path.join(__dirname, '..', 'public')));

		app.use(async (req, res, next) => {
			const user = await User.findByPk(1);
			req.user = user;
			next();
		});

		app.use('/admin', adminRoutes);
		app.use(shopRoutes);
		app.use(errorController.get404);

		// associations
		Product.belongsTo(User, { constraint: true, onDelete: 'cascade' });
		User.hasMany(Product);
		User.hasOne(Cart);
		Cart.belongsTo(User);
		Cart.belongsToMany(Product, { through: CartItem });
		Product.belongsTo(Cart, { through: CartItem });

		//await sequelize.sync({ force: true });
		await sequelize.sync();
		const user = await User.findByPk(1);
		if (!user) {
			User.create({ name: 'abdou', email: 'abdousfayhi12@gmail.com' });
			const cart = await User.createCart();
			console.log('app  : ', cart);
		}

		app.listen(3000);
	} catch (err) {
		console.log(err);
	}
}

module.exports = startServer;
