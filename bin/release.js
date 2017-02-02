#!/usr/bin/env node

'use strict';

const DIR = '../lib/';
const cl = require(DIR + 'cl');
const docs = require(DIR + 'docs');
const pack = require(DIR + 'pack');

cl((e, versionNew) => {
    if (error(e))
        return;
    
    docs(versionNew, (e, msg) => {
        error(e) || console.log(msg);
    });
    
    pack(versionNew, error);
});

function error(e) {
    e && console.error(e.message);
    return e;
}

