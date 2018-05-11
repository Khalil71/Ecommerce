const { Router } = require('express');

const Companies = require('./Companies.Controller');

const router = new Router();

router.get('/:name', Companies.GetCompany);

router.patch('/:name', Companies.UpdateCompanyInfo);

router.get('/:name/orders', Companies.GetComapnyOrders);

router.get('/:name/summary', Companies.GetComapnyMoney);

router.get('/item/info', Companies.getCompaniesByItem);

router.delete('/:name', Companies.DeleteCompanyData);

module.exports = router;
