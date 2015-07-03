(function() {
    'use strict';
    
    var fs          = require('fs'),
        path        = require('path'),
        jaguar      = require('jaguar'),
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
        var dir     = 'node_modules/',
            name    = 'cloudcmd-v' + version,
            from    = './' + dir + 'cloudcmd',
            to      = './' + dir + name;
        
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
                    process.stdout.write('\rcopy: ' + progress + '%');
                });
                
                copy.on('error', function(error) {
                    copy.abort();
                    wasError = true;
                    callback(error);
                });
                
                copy.on('end', function() {
                    process.stdout.write('\n');
                    wasError || callback();
                });
            },
            
            function rename(callback) {
                log('rename');
                fs.rename(from, to, callback);
            },
            
            function pack(callback) {
                var wasError,
                    cwd     = process.cwd(),
                    name    = 'cloudcmd-v' + version,
                    from    = path.join(cwd, 'node_modules'),
                    to      = path.join(cwd, name + '.tar.gz'),
                    packer  = jaguar.pack(from, to, [
                        name
                    ]);
                
                packer.on('error', function(error) {
                    wasError = true;
                    callback(error);
                });
                
                packer.on('progress', function(progress) {
                    process.stdout.write('\rpack: ' + progress + '%');
                });
                
                packer.on('end', function() {
                    process.stdout.write('\n');
                    !wasError && callback();
                });
            }
            
        ], callback);
    };
    
})();
