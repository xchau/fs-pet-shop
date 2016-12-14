'use strict';

const fs = require('fs'); // to read/write files
const path = require('path'); // ""
const petsJSONPath = path.join(__dirname, 'pets.json'); // string

const http = require('http'); // allows creation of server

const server = http.createServer((req, res) => {
  const petRegExp = /\/pets\/(.*)$/;

  if (req.method === 'GET' && req.url === '/pets') {
    fs.readFile(petsJSONPath, 'utf8', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');

        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(petsJSON);
    });
  }
  else if (req.method === 'GET' && petRegExp.test(req.url)) {
    // eslint-disable-next-line max-statements
    fs.readFile(petsJSONPath, 'utf8', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');

        return;
      }

      const pets = JSON.parse(petsJSON);
      const matches = req.url.match(petRegExp);
      const index = Number.parseInt(matches[1]);

      if (index < 0 || index >= pets.length || Number.isNaN(index)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');

        return;
      }

      const petJSON = JSON.stringify(pets[index]);

      res.setHeader('Content-Type', 'application/json');
      res.end(petJSON);
    });
  }
  else if (req.method === 'POST' && req.url === '/pets') {
    let bodyJSON = '';

    // "streaming"
    req.on('data', (chunk) => { // body of request (in chunks = binary data)
      bodyJSON += chunk.toString();
    });

    req.on('end', () => {
      // eslint-disable-next-line max-statements
      fs.readFile(petsJSONPath, 'utf8', (readErr, petsJSON) => {
        if (readErr) {
          console.error(readErr.stack);

          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Internal Server Error');

          return;
        }

        const pets = JSON.parse(petsJSON);
        const body = JSON.parse(bodyJSON);
        const age = Number.parseInt(body.age);
        const kind = body.kind;
        const name = body.name;

        if (Number.isNaN(age) || !kind || !name) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Bad Request');

          return;
        }

        const pet = { age, kind, name };

        pets.push(pet);

        const petJSON = JSON.stringify(pet);
        const updatedPetsJSON = JSON.stringify(pets);

        fs.writeFile(petsJSONPath, updatedPetsJSON, (writeErr) => {
          if (writeErr) {
            console.error(writeErr.stack);

            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal Server Error');

            return;
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(petJSON);
        });
      });
    });
  }
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = server;
