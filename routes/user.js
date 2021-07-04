const express = require('express');
const router = express.Router();

const { isAuthenticated, isLoggedin, isAdmin } = require('../controllers/auth');
const {
  getUserById,
  getUser,
  updateUser,
  userCartList,
} = require('../controllers/user');

//route params to set the res.profile
router.param('userId', getUserById);

//NOTE: to get the user from the id
router.get('/user/:userId', isLoggedin, isAuthenticated, getUser);

//update user
router.put('/user/:userId', isLoggedin, isAuthenticated, updateUser);

//populate user in cart model
router.post('/order/user/:userId', isLoggedin, isAuthenticated, userCartList);

//exporting
module.exports = router;
