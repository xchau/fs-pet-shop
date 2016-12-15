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
  // eslint-disable-next-line max-statements
  fs.readFile(petsJSONPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      next(readErr);
    }

    const index = Number.parseInt(req.params.id);
    const pets = JSON.parse(petsJSON);

    if (index < 0 || index >= pets.length || Number.isNaN(index)) {
      return res.sendStatus(404);
    }

    let age = Number.parseInt(req.body.age);
    let name = req.body.name;
    let kind = req.body.kind;
    let pet = {};

    if (Number.isNaN(age) && !name && !kind) {
      return res.sendStatus(400);
    }

    // Only name
    else if (name && !kind && Number.isNaN(age)) {
      age = pets[index].age;
      kind = pets[index].kind;
      pet = { name, kind, age };
    }

    // Only name & kind
    else if (name && kind && Number.isNaN(age)) {
      age = pets[index].age;
      pet = { name, kind, age };
    }

    // Only kind
    else if (kind && !name && Number.isNaN(age)) {
      age = pets[index].age;
      name = pets[index].name;
    }

    // Only age & kind
    else if (age && kind && !name) {
      name = pets[index].name;
      pet = { name, kind, age };
    }

    // Only age
    else if (age && !kind && !name) {
      name = pets[index].name;
      kind = pets[index].kind;
      pet = { name, kind, age };
    }

    // Only age & name
    else if (age && name && !kind) {
      kind = pets[index].kind;
      pet = { name, kind, age };
    }

    else {
      pet = { name, kind, age };
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

app.get('/boom', (_req, _res, next) => {
  next(new Error('BOOM!'));
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
