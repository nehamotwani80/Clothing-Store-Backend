const Product = require('../models/product');
const fs = require('fs');
const formidable = require('formidable');
const _ = require('lodash');
const { sortBy } = require('lodash');

//middleware for id
exports.getProductById = (req, res, next, id) => {
	Product.findById(id)
		.populate('category')
		.exec((err, prod) => {
			if (err) {
				res.status(400).json({
					error: 'NO Product found',
				});
			}
			req.product = prod;
			next();
		});
};

//middleware
exports.photo = (req, res, next) => {
	if (req.product.photo.data) {
		res.set('Content-Type', req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
};

//create product
//KEY: formidabe used here
exports.createProduct = (req, res) => {
	let form = formidable({ keepExtensions: true });
	form.parse(req, (err, fields, files) => {
		if (err) {
			res.status(400).json({
				error: 'file upload error',
			});
		}
		//TODO: put restrictions on fields
		const { name, price, description, category, stock } = fields;

		if (!name || !price || !description || !category || !stock) {
			return res.status(400).json({
				error: 'All fields are Required',
			});
		}
		const product = new Product(fields);
		//handling photo here
		//REVISIT: files.photo ?
		if (files.photo) {
			if (files.photo.size > 3000000) {
				return res.status(400).json({
					error: 'file size is too big',
				});
			}
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;
		}
		//saving to db
		product.save((err, prod) => {
			if (err) {
				return res.status(400).json({
					error: 'Failed to save Product',
				});
			}
			return res.json(prod);
		});
	});
};

//get single product
exports.getProduct = (req, res) => {
	req.product.photo = undefined;
	return res.json(req.product);
};

//get all products
exports.getAllProducts = (req, res) => {
	//REVISIT: check this ternary opterator and .sort and '_id'
	let limit = req.query.limit ? parseInt(req.query.limit) : 8;
	let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
	Product.find()
		.select('-photo')
		.limit(limit)
		.populate('category', 'name _id')
		.sort([[sortBy, 'asc']])
		.exec((err, items) => {
			if (err) {
				return res.status(400).json({
					error: 'No product found',
				});
			}
			res.json(items);
		});
};

//delete
exports.removeProduct = (req, res) => {
	const product = req.product;

	product.remove((err, deletedProduct) => {
		if (err) {
			return res.status(400).json({
				error: 'Failed to delete product',
			});
		}
		return res.json({
			msg: `Product ${deletedProduct.name} deleted successfully!`,
		});
	});
};

//update product
exports.updateProduct = (req, res) => {
	console.log(req);
	let form = formidable({ keepExtensions: true });
	form.parse(req, (err, fields, files) => {
		if (err) {
			res.status(400).json({
				error: 'file upload error',
			});
		}
		//product updation code
		let product = req.product;
		product = _.extend(product, fields);

		//handling photo here
		if (files.photo) {
			if (files.photo.size > 3000000) {
				return res.status(400).json({
					error: 'file size is too big',
				});
			}
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;
		}

		//saving to db
		product.save((err, item) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			}
			return res.json(item);
		});
	});
};

//stock updation middlewarwe
//TODO: check for errors, written differently (10th video)
exports.updateStock = (req, res) => {
	let myOperations = req.body.cart.products.forEach((item) => {
		[
			{
				updateOne: {
					filter: { _id: item._id },
					update: { stock: stock - 1, sold: sold + 1 },
				},
			},
		];
	});
	Product.bulkWrite(myOperations, {}, (err, products) => {
		if (err) {
			return res.status(400).json({
				error: 'Bulk operation failed',
			});
		}
		next();
	});
};

//TODO: A middleware for getting all categories
