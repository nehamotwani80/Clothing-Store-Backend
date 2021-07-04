const express = require('express');
const router = express.Router();

//controllers functions
const { isAuthenticated, isLoggedin, isAdmin } = require('../controllers/auth');
const { getUserById, pushOrderInPurchaseList } = require('../controllers/user');
const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateStatus,
  getOrderStatus,
} = require('../controllers/order');
const { updateStock } = require('../controllers/product');

//params route
router.param('orderId', getOrderById);
router.param('userId', getUserById);

//NOTE: no need to make getorder route here coz getOrderById is sending back the order created by the user, directly, when createroute is called
//read all order routes
router.get(
  '/allOrders/:userId',
  isLoggedin,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

//create route
router.post(
  '/order/create/:userId',
  isLoggedin,
  isAuthenticated,
  //   pushOrderInPurchaseList, //TODO: Open that
  updateStock, //REVISIT: try doing updatestock after order is created
  createOrder
);

//order status routes
router.get(
  '/order/status/:orderId/:userId',
  isLoggedin,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);

router.put(
  '/order/updateStatus/:orderId/:userId',
  isLoggedin,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
