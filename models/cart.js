const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
	static addProduct(id, price) {
		fs.readFile(p, (err, fileContent) => {
			let cart = { products: [], tottalPrice: 0 };
			if (!err) {
				cart = JSON.parse(fileContent);
			}
			const existingProductIndex = cart.products.findIndex((p) => p.id === id);
			const existingProduct = cart.products[existingProductIndex];
			let updatedProduct;
			if (existingProduct) {
				updatedProduct = { ...existingProduct };
				updatedProduct.qty = updatedProduct.qty + 1;
				cart.products = [ ...cart.products ];
				cart.products[existingProductIndex] = updatedProduct;
			} else {
				updatedProduct = { id, qty: 1 };
				//	cart.products = [ ...cart.products, updatedProduct ];
				cart.products.push(updatedProduct);
			}
			cart.tottalPrice = cart.tottalPrice + +price;
			fs.writeFile(p, JSON.stringify(cart), (err) => {
				console.log(err);
			});
		});
	}
	static deleteProduct(id, productPrice) {
		fs.readFile(p, (err, fileContent) => {
			if (err) {
				return;
			}
			let cart = { ...JSON.parse(fileContent) };
			const product = cart.products.find((prod) => prod.id === id);
			const updatedProducts = cart.products.filter((prod) => prod.id !== id);
			console.log(cart);
			cart.products = updatedProducts;
			cart.price -= productPrice * product.qty;
		});
	}
};

// const fs = require('fs');
// const path = require('path');

// const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

// module.exports = class Cart {
// 	static addProduct(id, productPrice) {
// 		// Fetch the previous cart
// 		fs.readFile(p, (err, fileContent) => {
// 			let cart = { products: [], totalPrice: 0 };
// 			if (!err) {
// 				cart = JSON.parse(fileContent);
// 			}
// 			// Analyze the cart => Find existing product
// 			const existingProductIndex = cart.products.findIndex((prod) => prod.id === id);
// 			const existingProduct = cart.products[existingProductIndex];
// 			let updatedProduct;
// 			// Add new product/ increase quantity
// 			if (existingProduct) {
// 				updatedProduct = { ...existingProduct };
// 				updatedProduct.qty = updatedProduct.qty + 1;
// 				cart.products = [ ...cart.products ];
// 				cart.products[existingProductIndex] = updatedProduct;
// 			} else {
// 				updatedProduct = { id: id, qty: 1 };
// 				cart.products = [ ...cart.products, updatedProduct ];
// 			}
// 			cart.totalPrice = cart.totalPrice + +productPrice;
// 			fs.writeFile(p, JSON.stringify(cart), (err) => {
// 				console.log(err);
// 			});
// 		});
// 	}
// };
