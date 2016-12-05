'use strict';

var place       = require('place'),
    rendy       = require('rendy'),
    shortdate   = require('shortdate');
    
module.exports = function(versionNew, callback) {
    var historyNew  = '',
        history     = '---------------\n',
        ext         = '.tar.gz',
        link        = '//github.com/cloudcmd/archive/raw/master/cloudcmd',
        template    = '- *{{ date }}*, '    +
                      '**[v{{ version }}]'   +
                      '(' + link + '-v{{ version }}{{ extension }})**\n';
    
    historyNew = history + rendy(template, {
        date        : shortdate(),
        version     : versionNew,
        extension   : ext
    });
    
    replaceVersion('README.md', history, historyNew, callback);
};

function replaceVersion(name, version, versionNew, callback) {
    place(name, version, versionNew, function(error) {
        var msg;
        
        if (!error)
            msg = 'done: ' + name;
        
        callback(error, msg);
    });
}
