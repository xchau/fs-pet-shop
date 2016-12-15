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
      return next(err);
    }

    const pets = JSON.parse(petsJSON);

    res.send(pets);
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

    const pet = pets[index];

    res.send(pet);
  });
});

app.post('/pets', (req, res, next) => {
  fs.readFile(petsJSONPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      return next(readErr);
    }

    const pets = JSON.parse(petsJSON);
    const age = Number.parseInt(req.body.age);
    const { name, kind } = req.body;

    if (Number.isNaN(age) || !kind || !name) { // negative age?
      return res.sendStatus(400);
    }

    const pet = { name, kind, age };

    pets.push(pet);

    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsJSONPath, newPetsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.send(pet);
    });
  });
});

app.patch('/pets/:id', (req, res, next) => {
  fs.readFile(petsJSONPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      next(readErr);
    }

    const index = Number.parseInt(req.params.id);
    const pets = JSON.parse(petsJSON);

    if (index < 0 || index >= pets.length || Number.isNaN(index)) {
      return res.sendStatus(404);
    }

    const age = Number.parseInt(req.body.age);
    const { name, kind } = req.body;
    const pet = { name, kind, age };

    if (Number.isNaN(age) || !name || !kind) {
      return res.sendStatus(400);
    }

    pets[index] = pet;

    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsJSONPath, newPetsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.set('Content-Type', 'application/json');
      res.send(pet);
    });
  });
});

app.delete('/pets/:id', (req, res, next) => {
  fs.readFile(petsJSONPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      return next(readErr);
    }

    const pets = JSON.parse(petsJSON);
    const index = Number.parseInt(req.params.id);

    if (index < 0 || index >= pets.length || Number.isNaN(index)) {
      return res.sendStatus(404);
    }

    const pet = pets.splice(index, 1)[0];
    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsJSONPath, newPetsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.set('Content-Type', 'application/json');
      res.send(pet);
    });
  });
});

// eslint-disable-next-line max-params
app.use((err, req, res, _next) => {
  console.error(err.stack);

  res.sendStatus(500);
});

app.use((req, res) => {
  res.sendStatus(404);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

module.exports = app;
