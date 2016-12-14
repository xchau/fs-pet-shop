#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const petsJSONPath = path.join(__dirname, 'pets.json');

const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];

const writeToFile = function(jsonFile) {
  fs.writeFile(petsJSONPath, jsonFile, (err) => {
    if (err) {
      throw err;
    }
  });
};

if (cmd === 'read') {
  fs.readFile(petsJSONPath, 'utf-8', (err, data) => {
    if (err) {
      throw err;
    }

    const pets = JSON.parse(data);
    const index = Number.parseInt(process.argv[3]);

    if (index < 0 || index >= pets.length) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }

    if (index === 0 || index) {
      console.log(pets[index]);
    }
    else {
      console.log(pets);
      process.exit();
    }
  });
}
else if (cmd === 'create') {
  fs.readFile(petsJSONPath, 'utf-8', (createReadErr, data) => {
    if (createReadErr) {
      throw createReadErr;
    }

    const pets = JSON.parse(data);
    const petAge = Number.parseInt(process.argv[3]);
    const petKind = process.argv[4];
    const petName = process.argv[5];

    if (Number.isNaN(petAge) || !petKind || !petName) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    const newPet = {
      age: petAge,
      kind: petKind,
      name: petName
    };

    pets.push(newPet);
    console.log(newPet);
    const petsJSON = JSON.stringify(pets);

    writeToFile(petsJSON);
  });
}
else if (cmd === 'update') {
  // eslint-disable-next-line max-statements
  fs.readFile(petsJSONPath, 'utf-8', (updateReadErr, data) => {
    if (updateReadErr) {
      throw updateReadErr;
    }

    const pets = JSON.parse(data);
    const index = Number.parseInt(process.argv[3]);
    const petAge = Number.parseInt(process.argv[4]);
    const petKind = process.argv[5];
    const petName = process.argv[6];

    if (index < 0 || index >= pets.length) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    if (Number.isNaN(index) || Number.isNaN(petAge) || !petKind || !petName) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    const pet = pets[index];

    pet.age = petAge;
    pet.kind = petKind;
    pet.name = petName;

    console.log(pet);
    const petsJSON = JSON.stringify(pets);

    writeToFile(petsJSON);
  });
}
else if (cmd === 'destroy') {
  fs.readFile(petsJSONPath, 'utf-8', (destroyReadErr, data) => {
    if (destroyReadErr) {
      throw destroyReadErr;
    }

    const pets = JSON.parse(data);
    const index = Number.parseInt(process.argv[3]);

    if (Number.isNaN(index)) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }

    if (index < 0 || index >= pets.length) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }

    const pet = pets[index];

    console.log(pet);
    pets.splice(index, 1);

    const petsJSON = JSON.stringify(pets);

    writeToFile(petsJSON);
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
