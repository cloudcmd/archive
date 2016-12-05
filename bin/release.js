#!/usr/bin/env node

'use strict';

var DIR         = '../lib/',
    cl          = require(DIR + 'cl'),
    docs        = require(DIR + 'docs'),
    pack        = require(DIR + 'pack');

cl(function(e, versionNew) {
    if (!error(e)) {
        docs(versionNew, function(e, msg) {
            error(e) || console.log(msg);
        });
        
        pack(versionNew, error);
    }
});

function error(e) {
    e && console.error(e.message);
    return e;
}

