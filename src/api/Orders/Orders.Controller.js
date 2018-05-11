const Order = require('./Orders.Service');
const { errResponse } = require('../../helpers/errors');
const valid = require('../../helpers/validators');

module.exports = {
  AddOrder: (req, res, next) => {
    if (!req.body.companyName || !valid.isWord.test(req.body.companyName)) {
      return next(errResponse('Please enter a valid companyName', 403));
    }
    if (!req.body.customerAddress || !valid.isAddress.test(req.body.customerAddress)) {
      return next(errResponse('Please enter a valid customerAddress', 403));
    }
    if (!req.body.orderedItem) {
      return next(errResponse('Please enter orderedItem', 403));
    }
    if (!req.body.price || !valid.isNumber.test(req.body.price)) {
      return next(errResponse('Please enter a valid price', 403));
    }
    if (!req.body.currency || !valid.ISOcurrency.test(req.body.currency)) {
      return next(errResponse('Please enter a valid currency', 403));
    }
    const body = {
      companyName: req.body.companyName.toLowerCase(),
      customerAddress: req.body.customerAddress.toLowerCase(),
      orderedItem: req.body.orderedItem.toLowerCase(),
      price: req.body.price,
      currency: req.body.currency
    };
    const instance = new Order(body);

    return instance
      .addOrder()
      .then(result => res.status(201).send(result))
      .catch(() => next(errResponse('Cannot add order', 403)));
  },

  GetByCompany: (req, res, next) => {
    if (!req.params.companyName || !valid.isWord.test(req.params.companyName)) {
      return next(errResponse('Please enter a valid companyName', 403));
    }
    const body = {
      companyName: req.params.companyName.toLowerCase()
    };
    const instance = new Order(body);

    return instance
      .getAllByCompany()
      .then(result => res.status(200).send(result))
      .catch(() => next(errResponse('Cannot find orders!', 403)));
  },

  GetByAddress: (req, res, next) => {
    if (!req.query.customerAddress || !valid.isAddress.test(req.query.customerAddress)) {
      return next(errResponse('Please enter a valid customerAddress', 403));
    }
    const body = {
      customerAddress: req.query.customerAddress.toLowerCase()
    };
    const instance = new Order(body);

    return instance
      .getAllByAddress()
      .then(result => res.status(200).send(result))
      .catch(() => next(errResponse('Cannot find orders!', 403)));
  },

  DeleteByOrderId: (req, res, next) => {
    if (!req.params.orderId || !valid.isNumber.test(req.params.orderId)) {
      return next(errResponse('Please enter a valid orderId', 403));
    }
    const body = {
      orderId: req.params.orderId
    };
    const instance = new Order(body);

    return instance
      .removeItemByOrderId()
      .then(result => {
        if (result === true) return res.status(204).send();
        return next(errResponse('Order not found!', 404));
      })
      .catch(() => next(errResponse('Cannot delete order', 403)));
  },

  ProductCount: (req, res, next) => {
    const instance = new Order();

    return instance
      .itemCount()
      .then(result => res.status(200).send(result))
      .catch(() => next(errResponse('Cannot count orders!', 403)));
  }
};
