(function() {
    'use strict';
    
    var fs      = require('fs'),
        jag     = require('jag'),
        async   = require('async'),
        move    = require('./move');
    
    module.exports = function(version, callback) {
        var dir     = './node_modules/',
            name    = 'cloudcmd-v' + version,
            from    = dir + 'cloudcmd',
            to      = dir + name;
        async.waterfall([
            function makeDir(callback) {
                var dir     = 'node_modules',
                    name    = './' + dir + '/cloudcmd/' + dir;
                
                fs.mkdir(name, function(error) {
                    if (error && error.code === 'EEXIST')
                        callback();
                });
            },
            
            function getNames(callback) {
                fs.readdir(dir, callback);
            },
            
            function moveModules(names, callback) {
                var dir     = 'node_modules',
                    from    = './' + dir,
                    to      = from + '/cloudcmd/' + dir;
                
                move(from, to, names, {
                    exclude: [
                        '.bin',
                        'cloudcmd',
                        'async',
                        'minor',
                        'place',
                        'shortdate'
                    ]
                }, callback);
            },
            
            function rename(callback) {
                fs.rename(from, to, callback);
            },
            
            function pack(callback) {
                jag.pack(to, './' + name, callback);
            }
            
        ], function(error) {
            callback(error);
        });
    };
    
})();
