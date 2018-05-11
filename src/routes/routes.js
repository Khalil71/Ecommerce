const { Router } = require('express');

const OrdersRoutes = require('../api/Orders/index');
const CompaniesRoutes = require('../api/Companies/index');

const router = new Router();

// Orders Routes
router.use('/orders', OrdersRoutes);

// Companies Routes
router.use('/companies', CompaniesRoutes);

module.exports = router;
