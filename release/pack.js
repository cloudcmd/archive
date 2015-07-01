(function() {
    'use strict';
    
    var fs          = require('fs'),
        jag         = require('jag'),
        async       = require('async'),
        copymitter  = require('copymitter'),
        log         = console.log,
        
        Exclude     = [
            '.bin',
            'cloudcmd',
            'async',
            'minor',
            'place',
            'shortdate',
        ];
    
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
                    log('makeDir');
                    
                    if (!error || error.code === 'EEXIST')
                        callback();
                    else
                        callback(error);
                });
            },
            
            function getNames(callback) {
                log('getNames');
                fs.readdir(dir, callback);
            },
            
            function copyModules(names, callback) {
                var wasError,
                    dir     = 'node_modules',
                    cwd     = process.cwd(),
                    from    = cwd + '/' + dir,
                    to      = from + '/cloudcmd/' + dir,
                    
                    files   = names.filter(function(name) {
                        return !~Exclude.indexOf(name);
                    }),
                    
                    copy    = copymitter(from, to, files);
                
                log('copyModules');
                
                copy.on('progress', function(progress) {
                    process.stdout.write('\r' + progress + '%');
                });
                
                copy.on('error', function(error) {
                    process.stdout.write('\n');
                    copy.abort();
                    wasError = true;
                    callback(error);
                });
                
                copy.on('end', function() {
                    wasError || callback();
                });
            },
            
            function rename(callback) {
                log('rename');
                fs.rename(from, to, callback);
            },
            
            function pack(callback) {
                log('pack');
                jag.pack(to, './' + name, callback);
            }
            
        ], callback);
    };
    
})();
