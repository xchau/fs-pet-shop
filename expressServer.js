'use strict';

const fs = require('fs');
const path = require('path');
const petsJSONPath = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();

app.disable('x-powered-by');

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/pets', (req, res) => {
  fs.readFile(petsJSONPath, 'utf8', (err, petsJSON) => {
    if (err) {
      console.error(err.stack);

      return res.sendStatus(500);
    }

    const pets = JSON.parse(petsJSON);

    res.send(pets);
  });
});

app.post('/pets', (req, res) => {
  fs.readFile(petsJSONPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      console.error(readErr.stack);

      return res.sendStatus(500);
    }

    const pets = JSON.parse(petsJSON);
    const name = req.body.name;
    const kind = req.body.kind;
    const age = Number.parseInt(req.body.age);

    if (Number.isNaN(age) || !age || !kind || !name) {
      return res.sendStatus(400);
    }

    const pet = { name, kind, age };

    pets.push(pet);

    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsJSONPath, newPetsJSON, (writeErr) => {
      if (writeErr) {
        console.error(writeErr.stack);

        return res.sendStatus(500);
      }

      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(pet));
    });
  });
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(petsJSONPath, 'utf8', (err, petsJSON) => {
    if (err) {
      console.error(err.stack);

      return res.sendStatus(500);
    }

    const pets = JSON.parse(petsJSON);
    const index = Number.parseInt(req.params.id);

    if (index < 0 || index >= pets.length || Number.isNaN(index)) {
      return res.sendStatus(404);
    }

    res.set('Content-Type', 'application/json');
    res.send(pets[index]);
  });
});

app.use((req, res) => {
  res.sendStatus(404);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

module.exports = app;
