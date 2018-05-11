const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const orderSchema = new mongoose.Schema({
  orderId: Number,
  companyInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
  companyName: String,
  customerAddress: String,
  orderedItem: String,
  price: Number,
  currency: String
});

module.exports = mongoose.model('orders', orderSchema);
