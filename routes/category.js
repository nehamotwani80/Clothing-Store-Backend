const express = require('express');
const router = express.Router();

//importing middlewares
const { isAuthenticated, isLoggedin, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const {
  getCategoryById,
  getCategory,
  getAllCategories,
  createCategory,
  removeCategory,
  updateCategory,
} = require('../controllers/category');

//middlewares
router.param('categoryId', getCategoryById);
router.param('userId', getUserById);

//read
router.get('/category/:categoryId', getCategory);
router.get('/categories', getAllCategories);

//create
router.post(
  '/category/create/:userId',
  isLoggedin,
  isAuthenticated,
  isAdmin,
  createCategory
);

//update
router.put(
  '/category/update/:categoryId/:userId',
  isLoggedin,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//delete
router.delete(
  '/category/delete/:categoryId/:userId',
  isLoggedin,
  isAuthenticated,
  isAdmin,
  removeCategory
);

// exporting router
module.exports = router;
