const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { errResponse } = require('./src/helpers/errors');
const routes = require('./src/routes/routes');
const { dbURL } = require('./src/config/config');

const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log('mongoose connection success'); // eslint-disable-line
  })
  .catch(e => console.log(e.message)); // eslint-disable-line

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', routes);

app.use((req, res, next) => {
  next(errResponse('Not Found', 404));
});
// error handler
app.use((err, req, res, next) => {
  res.status(err.status).send({ status: err.status, message: err.message });
  next();
});

app.listen(port, () => {
  console.log(`now listening on port ${port}`); // eslint-disable-line
});
