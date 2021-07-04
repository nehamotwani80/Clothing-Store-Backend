const { Cart, CartProduct } = require('../models/order');

//middleware
exports.getOrderById = (req, res, next, id) => {
  Cart.findById(id)
    .populate('products.product', 'name price')
    .exec((err, order) => {
      if (err) {
        res.status(400).json({
          error: 'NO product found in DB',
        });
      }
      res.json(order);
      next();
    });
};

//create order
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile; //REVISIT: try req.order.user here
  let order = new Cart(req.body.order);
  order.save((err, order) => {
    if (err) {
      res.status(400).json({
        error: 'Failed to save your Order',
      });
    }
    res.json(order);
  });
};

//get all orders
exports.getAllOrders = (req, res) => {
  Cart.find()
    .populate('user', 'name _id')
    .exec((err, orders) => {
      if (err) {
        res.status(400).json({
          error: 'No orders found in DB',
        });
      }
      res.json(orders);
    });
};

//get status
exports.getOrderStatus = (req, res) => {
  res.json(Cart.schema.path('status').enumValues); //REVISIT: read path and enumValues method
};

//update status
exports.updateStatus = (req, res) => {
  Cart.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        res.status(400).json({
          error: 'order status updation failed',
        });
      }
      res.json(order);
    }
  );
};
