(function() {
    'use strict';
    
    var path    = require('path'),
        fs      = require('fs');
    
    module.exports = function(from, to, files, options, callback) {
        if (!callback) {
            callback    = options;
            options     = {};
        }
        
        check(from, to, files, callback);
        
        move(from, to, files.slice(), options, callback);
    };
    
    function check(from, to, files, callback) {
        if (typeof from !== 'string')
            throw Error('from should be string!');
        
        if (typeof to !== 'string')
            throw Error('to should be string!');
        
        if (!Array.isArray(files))
            throw Error('files should be array!');
        
        if (typeof callback !== 'function')
            throw Error('callback should be function!');
    }
    
    function move(from, to, files, options, callback) {
        var name        = files.shift() || '',
            exclude     = [],
            fromName    = path.join(from, name),
            toName      = path.join(to, name);
        
        if (options && options.exclude)
            exclude = options.exclude;
        
        if (!name)
            callback();
        else if (~exclude.indexOf(name)) {
            move(from, to, files, options, callback);
        } else
            fs.rename(fromName, toName, function(error) {
                if (error && error.code !== 'ENOTEMPTY')
                    callback(error);
                else
                    move(from, to, files, options, callback);
            });
    }
})();
