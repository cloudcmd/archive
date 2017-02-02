'use strict';

const DIR = '../';
const minor = require('minor');
const Info = require(DIR + 'package');
const ERROR = Error('ERROR: version is missing. release --v<version> or --major --minor --patch');

module.exports  = (callback) => {
    const argv = process.argv;
    const length = argv.length - 1;
    const last = process.argv[length];
    const regExp = /^--(major|minor|patch)?/;
    const match = last.match(regExp);
    
    if (!regExp.test(last))
        return callback(ERROR);
    
    let versionNew;
    
    if (match[1])
        versionNew = minor(match[1], Info.version);
    else
        versionNew = last.substr(3);
    
    callback(null, versionNew);
};

