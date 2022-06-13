const Cart = require('./cart');
const db = require('../util/database');
module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		return db.execute(
			'insert into products (title,price,imageUrl,description) values( ? , ?  , ?  , ?)',
			[ this.title, this.price, this.imageUrl, this.description ]
		);
	}

	static async fetchAll() {
		return db.execute('select * from products');
	}
	static findById(id) {
		return db.execute('SELECT * FROM products WHERE id = ?', [ id ]);
	}
	static deleteById(id) {}
};
