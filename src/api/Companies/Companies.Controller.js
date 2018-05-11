const Company = require('./Companies.Service');
const { errResponse } = require('../../helpers/errors');
const valid = require('../../helpers/validators');

module.exports = {
  GetCompany: (req, res, next) => {
    if (!req.params.name || !valid.isWord.test(req.params.name)) {
      return next(errResponse('Please enter a valid name', 403));
    }
    const body = {
      name: req.params.name.toLowerCase()
    };

    const instance = new Company(body);

    return instance
      .getCompany()
      .then(result => {
        if (result === null) {
          return next(errResponse('Company not found', 404));
        }
        return res.status(200).send(result);
      })
      .catch(() => next(errResponse('Cannot get company!', 403)));
  },

  UpdateCompanyInfo: (req, res, next) => {
    if (!req.params.name || !valid.isWord.test(req.params.name)) {
      return next(errResponse('Please enter a valid name', 403));
    }
    if (!req.body.newName || !valid.isWord.test(req.body.newName)) {
      return next(errResponse('Please enter a valid newName', 403));
    }
    if (req.body.newName.toLowerCase() === req.params.name.toLowerCase()) {
      return next(errResponse('Please enter a diffrent newName', 403));
    }
    const body = {
      name: req.params.name.toLowerCase(),
      newName: req.body.newName.toLowerCase()
    };
    const instance = new Company(body);

    return instance
      .updateCompany()
      .then(result => {
        if (result === null) {
          return next(errResponse('Company not found', 404));
        }
        return res.status(200).send(result);
      })
      .catch(() => next(errResponse('Cannot update company!', 403)));
  },

  GetComapnyOrders: (req, res, next) => {
    if (!req.params.name || !valid.isWord.test(req.params.name)) {
      return next(errResponse('Please enter a valid name', 403));
    }
    const body = {
      name: req.params.name.toLowerCase()
    };
    const instance = new Company(body);

    return instance
      .getAllCompanyOrders()
      .then(result => {
        if (result.length === 0) {
          return next(errResponse('No orders found for this company!', 404));
        }
        return res.status(200).send(result);
      })
      .catch(() => next(errResponse('Cannot find orders!', 403)));
  },

  GetComapnyMoney: (req, res, next) => {
    if (!req.params.name || !valid.isWord.test(req.params.name)) {
      return next(errResponse('Please enter a valid name', 403));
    }
    const body = {
      name: req.params.name.toLowerCase()
    };
    const instance = new Company(body);

    return instance
      .companyAmountPaid()
      .then(result => {
        if (result.length === 0) {
          return next(errResponse('No orders found for this company!', 404));
        }
        return res.status(200).send(result);
      })
      .catch(() => next(errResponse('Cannot find orders!', 403)));
  },

  getCompaniesByItem: (req, res, next) => {
    if (!req.query.item) {
      return next(errResponse('Please enter an item', 403));
    }
    const body = {
      item: req.query.item.toLowerCase()
    };
    const instance = new Company(body);
    return instance
      .getCompaniesByItem()
      .then(result => res.status(200).send(result))
      .catch(() => next(errResponse('Cannot find item!', 403)));
  },

  DeleteCompanyData: (req, res, next) => {
    if (!req.params.name || !valid.isWord.test(req.params.name)) {
      return next(errResponse('Please enter a valid orderId', 403));
    }
    const body = {
      name: req.params.name
    };
    const instance = new Company(body);
    return instance
      .deleteCompanyData()
      .then(result => {
        if (result === false) return next(errResponse('Company not found!', 404));

        return res.status(204).send();
      })
      .catch(() => next(errResponse('Cannot delete company', 403)));
  }
};
