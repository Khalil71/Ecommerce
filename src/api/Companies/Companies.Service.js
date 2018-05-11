const OrdersCollection = require('../../models/orders');
const CompaniesCollection = require('../../models/companies');

class Companies {
  constructor(data) {
    this.data = data;
  }

  getCompany() {
    return CompaniesCollection.findOne({ name: this.data.name })
      .then(result => result)
      .catch(e => e);
  }

  updateCompany() {
    return CompaniesCollection.findOneAndUpdate(
      { name: this.data.name },
      { $set: { name: this.data.newName } },
      { new: true }
    )
      .then(result => result)
      .catch(e => e);
  }

  getAllCompanyOrders() {
    const getCompanyId = () =>
      CompaniesCollection.findOne({ name: this.data.name })
        .then(result => result)
        .catch(e => e);

    const getByCompany = data => {
      let query;
      // if the company doesn't exist in the companies collection then only look in old orders
      if (data === null) {
        query = OrdersCollection.find({ companyName: this.data.name });
      } else {
        // else look in all the orders
        query = OrdersCollection.find({
          $and: [{ $or: [{ companyName: this.data.name }, { companyInfo: data._id }] }] // eslint-disable-line
        });
      }
      return query
        .populate('companyInfo')
        .then(result => result)
        .catch(e => e);
    };

    return getCompanyId()
      .then(result => getByCompany(result))
      .then(out => out)
      .catch(e => e);
  }

  companyAmountPaid() {
    const getCompanyId = () =>
      CompaniesCollection.findOne({ name: this.data.name })
        .then(result => result)
        .catch(e => e);

    const companyTotal = data => {
      let match;
      if (data === null) {
        match = { $match: { companyName: this.data.name } };
      } else {
        match = { $match: { $or: [{ companyName: this.data.name }, { companyInfo: data._id }] } };
      }

      return OrdersCollection.aggregate([
        match,
        {
          $group: {
            _id: '$currency',
            totalAmount: { $sum: '$price' }
          }
        },
        {
          $sort: {
            totalAmount: -1
          }
        }
      ])
        .then(result => result)
        .catch(e => e);
    };

    return getCompanyId()
      .then(result => companyTotal(result))
      .catch(e => e);
  }

  getCompaniesByItem() {
    // check in new data format
    const newCompanies = () =>
      OrdersCollection.find({ orderedItem: this.data.item })
        .distinct('companyInfo')
        .then(result => {
          if (result.length === 0) return [];
          return result;
        })
        .then(result =>
          // Get company names
          CompaniesCollection.find({ _id: result })
            .distinct('name')
            .then(data => data)
            .catch(e => e)
        )
        .catch(e => e);

    // check in old data format
    const oldCompanies = data =>
      OrdersCollection.find({ orderedItem: this.data.item })
        .distinct('companyName')
        .then(result => result.concat(data)) // merge the array from newCompanies and this resulting array
        .then(out => Array.from(new Set(out))) // removing all dublicates incase the company has orders in new data format or old
        .catch(e => e);

    return newCompanies()
      .then(result => oldCompanies(result))
      .catch(e => e);
  }

  deleteCompanyData() {
    const deleteCopaniesInCollection = () =>
      CompaniesCollection.findOneAndRemove({ name: this.data.name })
        .then(result => result)
        .catch(e => e);
    const cahngeOrdersAssociatedToOldFormat = data => {
      if (data === null) {
        return false;
      }
      return OrdersCollection.update(
        { companyInfo: data._id },
        { $unset: { companyInfo: 1 }, $set: { companyName: data.name } },
        { multi: true }
      )
        .then(() => true)
        .catch(e => e);
    };

    return deleteCopaniesInCollection()
      .then(result => cahngeOrdersAssociatedToOldFormat(result))
      .then(result => result)
      .catch(e => e);
  }
}

module.exports = Companies;
