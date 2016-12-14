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

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
