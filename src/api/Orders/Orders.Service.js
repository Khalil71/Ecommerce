const OrdersCollection = require('../../models/orders');
const CompaniesCollection = require('../../models/companies');

class Orders {
  constructor(data) {
    this.data = data;
  }

  addOrder() {
    // Get the new orderId by getting the last order in the collection takeing its orderId and adding 1
    // If there are no orders then return 1
    const createOrderId = () =>
      OrdersCollection.findOne()
        .sort({ _id: -1 })
        .then(result => {
          if (result === null) {
            return 1;
          }
          return result.orderId + 1;
        })
        .catch(e => e);

    // get company Id if exists else create comapny
    const findOrCreateCompany = orderId =>
      CompaniesCollection.collection
        .findAndModify(
          { name: this.data.companyName },
          [],
          { name: this.data.companyName },
          {
            new: true,
            upsert: true
          }
        )
        .then(result => {
          const data = { orderId, companyRef: result.value._id };
          return data;
        })
        .catch(e => e);

    const saveNewOrder = info => {
      const order = new OrdersCollection({
        companyInfo: info.companyRef,
        customerAddress: this.data.customerAddress,
        orderedItem: this.data.orderedItem,
        price: this.data.price,
        currency: this.data.currency,
        orderId: info.orderId
      });
      return order
        .save()
        .then(data => data)
        .catch(e => e);
    };
    // In order to view the new order with companyInfo populated
    const ReturnNewColectionPopulated = orderId =>
      OrdersCollection.findOne({ orderId })
        .populate('companyInfo')
        .then(result => result)
        .catch(e => e);

    return createOrderId()
      .then(data => findOrCreateCompany(data))
      .then(result => saveNewOrder(result))
      .then(result => ReturnNewColectionPopulated(result.orderId))
      .catch(e => e);
  }

  getAllByCompany() {
    const getCompanyId = () =>
      CompaniesCollection.findOne({ name: this.data.companyName })
        .then(result => result)
        .catch(e => e);

    const getByCompany = data => {
      // query vaiable is created because mongo won't accept companyInfo to have value of null
      let query;
      // if the company doesn't exist in the companies collection then only look in old orders
      if (data === null) {
        query = OrdersCollection.find({ companyName: this.data.companyName });
      } else {
        // else look in all the orders
        query = OrdersCollection.find({
          $and: [{ $or: [{ companyName: this.data.companyName }, { companyInfo: data._id }] }]
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

  getAllByAddress() {
    return OrdersCollection.find({ customerAddress: this.data.customerAddress })
      .populate('companyInfo')
      .then(result => result)
      .catch(e => e);
  }

  removeItemByOrderId() {
    return OrdersCollection.remove({ orderId: this.data.orderId })
      .then(result => {
        if (result.n > 0) {
          return true;
        }
        return false;
      })
      .catch(e => e);
  }

  itemCount() {
    return OrdersCollection.aggregate([
      {
        $group: {
          _id: '$orderedItem',
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ])
      .then(result => result)
      .catch(e => e);
  }
}

module.exports = Orders;
