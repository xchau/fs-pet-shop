'use strict';

const express = require('express');
const app = express();

app.disable('x-powered-by');

const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('short'));
app.use(bodyParser.json());

const petRoutes = require('./routes/pets');

app.use(petRoutes);

app.use((req, res) => {
  res.sendStatus(404);
});

// eslint-disable-next-line max-params
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.sendStatus(500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
