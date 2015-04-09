(function() {
    'use strict';
    
    var cl          = require('./cl'),
        pack        = require('./pack'),
        place       = require('place'),
        rendy       = require('rendy'),
        shortdate   = require('shortdate');
        
    module.exports = function(callback) {
        var history     = '---------------\n',
            ext         = '.tar.gz',
            link        = '//github.com/cloudcmd/archive/raw/master/cloudcmd',
            template    = '- *{{ date }}*, '    +
                          '**[v{{ version }}]'   +
                          '(' + link + '-v{{ version }}{{ extension }})**\n';
        
        cl(function(e, versionNew) {
            var historyNew;
            
            if (!error(e, callback)) {
                historyNew = history + rendy(template, {
                    date        : shortdate(),
                    version     : versionNew,
                    extension   : ext
                });
                
                replaceVersion('README.md', history, historyNew, function(e) {
                    if (!error(e, callback))
                        pack(versionNew, callback);
                });
            }
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
