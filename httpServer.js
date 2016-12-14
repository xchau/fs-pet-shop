'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const petsJSONPath = path.join(__dirname, 'pets.json');

const petRegExp = /\/(pets)\/(.*)$/;
const petRegExp2 = /\/(\w+)/;

const server = http.createServer((req, res) => {
  const url = req.url.match(petRegExp);
  const url2 = req.url.match(petRegExp2);

  if (req.method === 'GET' && req.url === '/pets') {
    fs.readFile(petsJSONPath, 'utf8', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);

        res.statusCode = 500;
        res.setHeader = ('Content-Type', 'text/plain');
        res.end('Internal Server Error');

        return;
      }

      res.setHeader = ('Content-Type', 'application/json');
      res.end(petsJSON);
    });
  }
  else if (req.url === '/' || url2[1] !== 'pets') {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
  else if (req.method === 'GET' && /[01]/.test(url[2]) && Number.parseInt(url[2]) >= 0) {
    fs.readFile(petsJSONPath, 'utf8', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);

        res.statusCode = 500;
        res.setHeader = ('Content-Type', 'text/plain');
        res.end('Internal Server Error');

        return;
      }

      const index = req.url.match(petRegExp)[2];
      const pets = JSON.parse(petsJSON);

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(pets[index]));
    });
  }
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

const port = process.env.PORT || 3456;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
