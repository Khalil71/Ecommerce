const { Router } = require('express');

const Orders = require('./Orders.Controller');

const router = new Router();

router.post('/', Orders.AddOrder);

router.get('/company/:companyName', Orders.GetByCompany);

router.get('/address', Orders.GetByAddress);

router.delete('/:orderId', Orders.DeleteByOrderId);

router.get('/summary', Orders.ProductCount);

module.exports = router;
