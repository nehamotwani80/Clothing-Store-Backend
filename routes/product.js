const express = require('express');
const router = express.Router();
const {
	getProductById,
	createProduct,
	updateProduct,
	getProduct,
	getAllProducts,
	removeProduct,
	photo,
} = require('../controllers/product');
const { isAuthenticated, isLoggedin, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

//params getting middleware
router.param('productId', getProductById);
router.param('userId', getUserById);

//create route
router.post(
	'/product/create/:userId',
	isLoggedin,
	isAuthenticated,
	isAdmin,
	createProduct
);

// read routes
router.get('/product/:productId', getProduct);
router.get('/product/photo/:productId', photo);
router.get('/products', getAllProducts);

//update route
router.put(
	'/product/update/:productId/:userId',
	isLoggedin,
	isAuthenticated,
	isAdmin,
	updateProduct
	// (req, res) => {
	// 	console.log(req);
	// 	return res.json({ msg: 'working' });
	// }
);

//delete route
router.delete(
	'/product/delete/:productId/:userId',
	isLoggedin,
	isAuthenticated,
	isAdmin,
	removeProduct
);

module.exports = router;
