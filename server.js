'use strict';

const express = require('express');
const app = express();

app.disable('x-powered-by');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');

app.use(morgan('short'));
app.use(bodyParser.json());

const petRoutes = require('./routes/pets');

app.use((req, res, next) => {
  const creds = basicAuth(req);

  if (creds && creds.name === 'admin' && creds.pass === 'meowmix') {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="Required"');
  res.sendStatus(401);
});

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
