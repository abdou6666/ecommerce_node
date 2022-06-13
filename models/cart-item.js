const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const CartItem = sequelize.define('cartItem', {
	id: {
		type: Sequelize.INTEGER,
		allowIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	qty: {
		type: Sequelize.INTEGER
	}
});

module.exports = CartItem;
