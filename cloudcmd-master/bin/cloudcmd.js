#!/usr/bin/env node

'use strict';

const Info = require('../package');
const DIR_SERVER = '../server/';

const exit = require(DIR_SERVER + 'exit');
const config = require(DIR_SERVER + 'config');
const env = require(DIR_SERVER + 'env');

const choose = (a, b) => {
    if (!a && typeof a !== 'boolean')
        return b;
    
    return a;
};

const argv = process.argv;
const args = require('minimist')(argv.slice(2), {
    string: [
        'port',
        'password',
        'username',
        'config',
        'editor',
        'packer',
        'root',
        'prefix',
        'terminal-path',
    ],
    boolean: [
        'auth',
        'repl',
        'save',
        'server',
        'online',
        'open',
        'minify',
        'progress',
        'config-dialog',
        'console',
        'terminal',
        'one-panel-mode',
        'html-dialogs'
    ],
    default: {
        server      : true,
        auth        : config('auth'),
        port        : config('port'),
        minify      : config('minify'),
        online      : config('online'),
        open        : config('open'),
        editor      : config('editor') || 'edward',
        packer      : config('packer') || 'tar',
        zip         : config('zip'),
        username    : config('username'),
        root        : config('root') || '/',
        prefix      : config('prefix') || '',
        progress    : config('progress'),
        console     : config('console'),
        terminal    : choose(env.bool('terminal'), config('terminal')),
        
        'terminal-path': env('terminal_path') || config('terminalPath'),
        'config-dialog': choose(env.bool('config_dialog'), config('configDialog')),
        'one-panel-mode': config('onePanelMode'),
        'html-dialogs': config('htmlDialogs')
    },
    alias: {
        v: 'version',
        h: 'help',
        p: 'password',
        o: 'online',
        u: 'username',
        s: 'save',
        a: 'auth',
        c: 'config'
    },
    unknown: (cmd) => {
        exit('\'%s\' is not a cloudcmd option. See \'cloudcmd --help\'.', cmd);
    }
});

if (args.version) {
    version();
} else if (args.help) {
    help();
} else {
    if (args.repl)
        repl();
    
    checkUpdate();
    
    port(args.port);
    
    config('auth', args.auth);
    config('online', args.online);
    config('open', args.open);
    config('minify', args.minify);
    config('username', args.username);
    config('progress', args.progress);
    config('console', args.console);
    config('terminal', args.terminal);
    config('terminalPath', args['terminal-path']);
    config('editor', args.editor);
    config('prefix', args.prefix);
    config('root', args.root);
    config('htmlDialogs', args['html-dialogs']);
    config('onePanelMode', args['one-panel-mode']);
    config('configDialog', args['config-dialog']);
    
    readConfig(args.config);
    
    const options = {
        root: args.root || '/', /* --no-root */
        editor: args.editor,
        packer: args.packer,
        prefix: args.prefix
    };
    
    if (args.password)
        config('password', getPassword(args.password));
    
    validateRoot(options.root);
    
    if (!args.save)
        start(options);
    else
        config.save(() => {
            start(options);
        });
}

function validateRoot(root) {
    const validate = require(DIR_SERVER + 'validate');
    validate.root(root, console.log);
}

function getPassword(password) {
    const criton = require('criton');
    
    return criton(password, config('algo'));
}

function version() {
    console.log('v' + Info.version);
}

function start(config) {
    const SERVER = DIR_SERVER + 'server';
    
    if (args.server)
        require(SERVER)(config);
}

function port(arg) {
    const number = parseInt(arg, 10);
    
    if (!isNaN(number))
        config('port', number);
    else
        exit('cloudcmd --port: should be a number');
}

function readConfig(name) {
    if (!name)
        return;
    
    const fs = require('fs');
    const tryCatch = require('try-catch');
    const jju = require('jju');
    
    const readjsonSync = (name) => jju.parse(fs.readFileSync(name, 'utf8'), {
        mode: 'json'
    });
    
    let data;
    
    const error = tryCatch(() => {
        data = readjsonSync(name);
    });
    
    if (error)
        return exit(error.message);
    
    Object.keys(data).forEach((item) => {
        config(item, data[item]);
    });
}

function help() {
    const bin = require('../json/help');
    const usage = 'Usage: cloudcmd [options]';
    const url = Info.homepage;
    
    console.log(usage);
    console.log('Options:');
    
    Object.keys(bin).forEach((name) => {
        console.log('  %s %s', name, bin[name]);
    });
    
    console.log('\nGeneral help using Cloud Commander: <%s>', url);
}

function repl() {
    console.log('REPL mode enabled (telnet localhost 1337)');
    require(DIR_SERVER + 'repl');
}

function checkUpdate() {
    const load = require('package-json');
    const noop = () => {};
    
    load(Info.name, 'latest')
        .then(showUpdateInfo)
        .catch(noop);
}

function showUpdateInfo(data) {
    const version = data.version;
    
    if (version !== Info.version) {
        const chalk = require('chalk');
        const rendy = require('rendy');
        
        const latest = rendy('update available: {{ latest }}', {
            latest: chalk.green.bold('v' + version),
        });
        
        const current = chalk.dim(rendy('(current: v{{ current }})', {
            current: Info.version
        }));
        
        console.log('%s %s', latest, current);
    }
}

