const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

// schema for product inside cart
const cartProductSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: 'Product',
  },
  name: String,
  count: Number,
  totalPrice: Number,
});

const cartSchema = new mongoose.Schema(
  {
    products: [cartProductSchema],
    transaction_id: {},
    amount: Number,
    status: {
      type: String,
      default: 'Confirmed',
      enum: ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Canceled'],
    },
    user: { type: ObjectId, ref: 'User' },
    address: { type: String, maxlength: 200 },
    updated: Date,
  },
  { timestamps: true }
);

//export

const Cart = mongoose.model('Cart', cartSchema);
const CartProduct = mongoose.model('CartProduct', cartProductSchema);
module.exports = { Cart, CartProduct };
