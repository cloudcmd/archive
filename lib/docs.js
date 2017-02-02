'use strict';

const place = require('place');
const shortdate = require('shortdate');

module.exports = (version, callback) => {
    const history = '---------------\n';
    const ext = '.tar.gz';
    const link = '//github.com/cloudcmd/archive/raw/master/cloudcmd';
    const template =
        `- *${ shortdate()}*, `       +
        `**[v${ version }]`     +
        `(${ link }-v${ version }${ ext })**\n`;
    
    const historyNew = history + template;
    
    replaceVersion('README.md', history, historyNew, callback);
};

function replaceVersion(name, version, versionNew, callback) {
    place(name, version, versionNew, (error) => {
        let msg;
        
        if (!error)
            msg = 'done: ' + name;
        
        callback(error, msg);
    });
}

