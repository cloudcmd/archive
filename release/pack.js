(function() {
    'use strict';
    
    var fs  = require('fs'),
        jag = require('jag');
    
    module.exports = function(version) {
        var dir     = '/node_modules/',
            name    = 'cloudcmd-' + version,
            from    = dir + 'cloudcmd',
            to      = dir + name;
        
        fs.rename(from, to, function(e) {
            if (!error(e))
                jag.pack(to, './' + name, error);
        });
    };
    
    function error(e) {
        e && console.error(e.message);
        return e;
    }
    
})();
