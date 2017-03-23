#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../server');
const dir_ = path.join(__dirname, '../legacy/server');

const setDir = (name) => {
    return path.join(dir_, name);
};

fs.readdirSync(dir)
  .map(fillFile)
  .map(writeFile);

function fillFile(name) {
    return {
        name: setDir(name),
        data: `module.exports = require(\'../../server_/${name}\');`
    };
}

function writeFile({name, data}) {
    return fs.writeFileSync(name, data);
}

