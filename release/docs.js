(function() {
    'use strict';
    
    var DIR         = '../',
        
        cl          = require('./cl'),
        pack        = require('./pack'),
        place       = require('place'),
        rendy       = require('rendy'),
        shortdate   = require('shortdate'),
        Info        = require(DIR + 'package');
        
    module.exports = function(callback) {
        var history     = 'Version history\n---------------\n',
            ext         = '.tar.gz',
            link        = '//github.com/cloudcmd/archive/raw/master/cloudcmd',
            template    = '- *{{ date }}*, '    +
                          '**[v{{ version }}]'   +
                          '(' + link + '-v{{ version }}{{ extension }})**\n',
            version     = Info.version;
        
        cl(function(e, versionNew) {
            if (!error(e, callback))
                replaceVersion('README.md', version, versionNew, function() {
                    var historyNew = history + rendy(template, {
                        date        : shortdate(),
                        version     : versionNew,
                        extension   : ext
                    });
                    
                    replaceVersion('README.md', history, historyNew, function(e) {
                        if (!error(e, callback))
                            pack(versionNew, callback);
                    });
                });
        });
    };
    
    function error(e, callback) {
        e && callback(e);
        return e;
    }
    
    function replaceVersion(name, version, versionNew, callback) {
        place(name, version, versionNew, function(error) {
            var msg;
            
            if (!error)
                msg = 'done: ' + name;
            
            callback(error, msg);
        });
    }
})();
