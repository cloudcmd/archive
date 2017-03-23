/* global CloudCmd */
/* global DOM */

'use strict';

const Images = require('./images');
const {FS} = require('../../common/cloudfunc');

module.exports = (items) => {
    const Info = DOM.CurrentInfo;
    const load = DOM.load;
    const Dialog = DOM.Dialog;
    
    if (items.length)
        Images.show('top');
    
    const entries = [...items].map((item) => {
        return item.webkitGetAsEntry();
    });
    
    const addDir = (name) => {
        return `/modules/${name}/lib/${name}.js`;
    };
    
    const array   = [
        'findit',
        'philip'
    ];
    
    const url = CloudCmd.join(array.map(addDir));
    
    load.js(url, () => {
        const path = Info.dirPath
            .replace(/\/$/, '');
        
        const uploader = window.philip(entries, (type, name, data, i, n, callback) => {
            const prefixURL = CloudCmd.PREFIX_URL;
            const full = prefixURL + FS + path + name;
            
            let upload;
            switch(type) {
            case 'file':
                upload = uploadFile(full, data);
                break;
            
            case 'directory':
                upload = uploadDir(full);
                break;
            }
            
            upload.on('end', callback);
            
            upload.on('progress', (count) => {
                const current = percent(i, n);
                const next = percent(i + 1, n);
                const max = next - current;
                const value = current + percent(count, 100, max);
                
                setProgress(value);
            });
        });
        
        uploader.on('error', (error) => {
            Dialog.alert(error);
            uploader.abort();
        });
        
        uploader.on('progress', setProgress);
        uploader.on('end', CloudCmd.refresh);
    });
};

function percent(i, n, per = 100) {
    return Math.round(i * per / n);
}

function setProgress(count) {
    DOM.Images
        .setProgress(count)
        .show('top');
}

function uploadFile(url, data) {
    return DOM.load.put(url, data);
}

function uploadDir(url) {
    return DOM.load.put(url + '?dir');
}

