'use strict';

const fs = require('fs');
const path = require('path');
const petsJSONPath = path.join(__dirname, '../pets.json');

const express = require('express');
const router = express.Router();

router.get('/pets', (req, res, next) => {
  fs.readFile(petsJSONPath, 'utf8', (err, petsJSON) => {
    if (err) {
      return next(err);
    }

    const pets = JSON.parse(petsJSON);

    res.send(pets);
  });
});

router.get('/pets/:id', (req, res, next) => {
  fs.readFile(petsJSONPath, 'utf8', (err, petsJSON) => {
    if (err) {
      return next(err);
    }

    const pets = JSON.parse(petsJSON);
    const index = Number.parseInt(req.params.id);

    if (index < 0 || index >= pets.length || Number.isNaN(index)) {
      return res.sendStatus(400);
    }

    res.set('Content-Type', 'text/plain');
    res.send(pets[index]);
  });
});

router.post('/pets', (req, res, next) => {
  fs.readFile(petsJSONPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      return next(readErr);
    }

    const pets = JSON.parse(petsJSON);
    const age = Number.parseInt(req.body.age);
    const { name, kind } = req.body;

    if (Number.isNaN(age) || !name || !kind) {
      return res.sendStatus(400);
    }

    const pet = { name, age, kind };

    pets.push(pet);

    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsJSONPath, newPetsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.send(pets);
    });
  });
});

router.patch('/pets/:id', (req, res, next) => {
  // eslint-disable-next-line max-statements
  fs.readFile(petsJSONPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      return next(readErr);
    }

    const pets = JSON.parse(petsJSON);
    const index = req.params.id;

    if (index < 0 || index >= pets.length || Number.isNaN(index)) {
      return res.sendStatus(400);
    }

    const age = Number.parseInt(req.body.age);
    const { name, kind } = req.body;

    if (!Number.isNaN(age)) {
      pets[index].age = age;
    }

    if (kind) {
      pets[index].kind = kind;
    }

    if (name) {
      pets[index].name = name;
    }

    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsJSONPath, newPetsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.send(pets[index]);
    });
  });
});

router.delete('/pets/:id', (req, res, next) => {
  
})
