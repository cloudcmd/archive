'use strict';

const fs = require('fs');
const path = require('path');
const jaguar = require('jaguar');
const async = require('async');
const copymitter = require('copymitter');
const log = console.log;

const Exclude = require('./exclude');

module.exports = (version, callback) => {
    const dir = 'node_modules/';
    const name = 'cloudcmd-v' + version;
    const from = './' + dir + 'cloudcmd';
    const to = './' + dir + name;
    
    async.waterfall([
        function makeDir(callback) {
            const dir = 'node_modules';
            const name = './' + dir + '/cloudcmd/' + dir;
            
            fs.mkdir(name, (error) => {
                log('makeDir');
                
                if (!error || error.code === 'EEXIST')
                    return callback();
                
                callback(error);
            });
        },
        
        function getNames(callback) {
            log('getNames');
            fs.readdir(dir, callback);
        },
        
        function copyModules(names, callback) {
            const dir = 'node_modules';
            const cwd = process.cwd();
            const from = cwd + '/' + dir;
            const to = from + '/cloudcmd/' + dir;
                
            const files = names.filter((name) => {
                return !~Exclude.indexOf(name);
            });
            
            const copy = copymitter(from, to, files);
            
            log('copyModules');
            
            copy.on('progress', (progress) => {
                process.stdout.write('\rcopy: ' + progress + '%');
            });
            
            copy.on('error', (e) => {
                process.stdout.write('\n');
                callback(e);
            });
            
            copy.on('end', () => {
                process.stdout.write('\n');
                callback();
            });
        },
        
        function rename(callback) {
            log('rename:', from, '->', to);
            fs.rename(from, to, callback);
        },
        
        function pack(callback) {
            const cwd = process.cwd();
            const name = 'cloudcmd-v' + version;
            const from = path.join(cwd, 'node_modules');
            const to = path.join(cwd, name + '.tar.gz');
            const packer = jaguar.pack(from, to, [
                name
            ]);
            
            packer.on('error', callback);
            
            packer.on('progress', (progress) => {
                process.stdout.write('\rpack: ' + progress + '%');
            });
            
            packer.on('end', () => {
                process.stdout.write('\n');
                callback();
            });
        }
        
    ], callback);
};

