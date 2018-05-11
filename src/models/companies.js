const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const companySchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

module.exports = mongoose.model('companies', companySchema);
