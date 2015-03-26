(function() {
    'use strict';
    
    var fs  = require('fs'),
        jag = require('jag');
    
    module.exports = function(version, callback) {
        var dir     = './node_modules/',
            name    = 'cloudcmd-v' + version,
            from    = dir + 'cloudcmd',
            to      = dir + name;
        
        fs.rename(from, to, function(e) {
            if (!error(e, callback))
                jag.pack(to, './' + name, callback);
        });
    };
    
    function error(e, callback) {
        e && callback(e);
        return e;
    }
    
})();
