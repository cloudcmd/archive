#!/usr/bin/env node

'use strict';

const DIR = '../lib/';
const cl = require(DIR + 'cl');
const docs = require(DIR + 'docs');
const pack = require(DIR + 'pack');

const version = process.env.WISDOM_VERSION;

docs(versionNew, (e, msg) => {
    error(e) || console.log(msg);
});

function error(e) {
    e && console.error(e.message);
    return e;
}

