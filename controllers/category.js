const Category = require('../models/category');

//extracting params
exports.getCategoryById = (req, res, next, id) => {
	Category.findById(id).exec((err, item) => {
		if (err) {
			res.status(400).send(err);
		}
		req.category = item;
		next();
	});
};

exports.getCategory = (req, res) => {
	res.json(req.category);
};

exports.getAllCategories = (req, res) => {
	Category.find().exec((err, items) => {
		if (err) {
			res.status(400).send(err);
		}
		res.json(items);
	});
};

exports.createCategory = (req, res) => {
	const category = new Category(req.body);

	category.save((err, item) => {
		if (err) {
			return res.status(400).json({ error: err });
		} else return res.status(201).json(item);
	});
};

exports.updateCategory = (req, res) => {
	console.log(req);
	Category.findByIdAndUpdate(
		{ _id: req.category._id },
		{ $set: req.body },
		{ new: true },
		(err, item) => {
			if (err || !item) {
				res.status(404).json({ error: 'Updation failed' });
			}
			res.json(item);
		}
	);
};

exports.removeCategory = (req, res) => {
	Category.deleteOne({ _id: req.category._id }, (err, item) => {
		if (err) {
			res.status(400).json({ error: 'category deletion unsuccessful' });
		}
		res.json({ msg: `category ${req.category.name} deletion successful` });
	});
};
