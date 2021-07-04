const User = require('../models/user');
const { Cart } = require('../models/order');

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: 'NO user found',
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encriptPassword = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'Updation failed' });
      }
      user.salt = undefined;
      user.encriptPassword = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
};

exports.userCartList = (req, res) => {
  Cart.find({ user: req.profile._id })
    .populate('user', 'name _id')
    .exec((err, cartOrder) => {
      if (err) {
        res.status(400).json({
          error: 'No Order in this account',
        });
      }
      res.json(cartOrder);
    });
};

//TODO: write pushItemInPurchaseList middleware to insert order items
// exports.pushItemInPurchaseList = (req, res) => {
//   User.find({_id: req.profile._id})
//   .push
// };
//middleware
