#!/usr/bin/env node

'use strict';

const DIR = '../lib/';
const docs = require(DIR + 'docs');

const version = process.env.WISDOM_VERSION;

docs(version, (e, msg) => {
    error(e) || console.log(msg);
});

function error(e) {
    e && console.error(e.message);
    return e;
}

