'use strict';

const fs = require('fs');
const path = require('path');
const petsJSONPath = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();

app.disable('x-powered-by');

const morgan = require('morgan');

app.use(morgan('short'));

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/pets', (req, res, next) => {
  fs.readFile(petsJSONPath, 'utf8', (err, petsJSON) => {
    if (err) {
      return next(err); // looks for middleware w/ 4 errors
    }

    const pets = JSON.parse(petsJSON);

    res.send(pets);
  });
});

app.post('/pets', (req, res, next) => {
  fs.readFile(petsJSONPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      return next(readErr);
    }

    const pets = JSON.parse(petsJSON);
    const age = Number.parseInt(req.body.age);
    const { kind, name } = req.body; // object destructuring
    // const name = req.body.name;
    // const kind = req.body.kind;

    if (Number.isNaN(age) || !kind || !name) {
      return res.sendStatus(400);
    }

    const pet = { name, kind, age }; // object literal shorthand (≈structuring)

    pets.push(pet);

    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsJSONPath, newPetsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(pet));
    });
  });
});

app.get('/pets/:id', (req, res, next) => {
  fs.readFile(petsJSONPath, 'utf8', (err, petsJSON) => {
    if (err) {
      return next(err);
    }

    const pets = JSON.parse(petsJSON);
    const index = Number.parseInt(req.params.id);

    if (index < 0 || index >= pets.length || Number.isNaN(index)) {
      return res.sendStatus(404);
    }

    res.set('Content-Type', 'application/json'); // unnecessary - returning obj
    res.send(pets[index]);
  });
});

// creating custom error
app.get('/boom', (_req, _res, next) => {
  next(new Error('BOOM!')); // sets error.message
});

app.use((req, res) => {
  res.sendStatus(404);
});

// eslint-disable-next-line max-params
app.use((err, _req, res, _next) => {
  console.error(err.stack);

  res.sendStatus(500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening to port ${port}`); // blocking I/O (SLOW!)
});

module.exports = app;
