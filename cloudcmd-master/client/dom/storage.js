'use strict';

const itype = require('itype/legacy');
const jonny = require('jonny');
const exec = require('execon');

/* приватный переключатель возможности работы с кэшем */
let Allowed;

/* функция проверяет возможно ли работать с кэшем каким-либо образом */
module.exports.isAllowed = () => {
    return Allowed && !!localStorage;
};

/**
 * allow Storage usage
 */
module.exports.setAllowed = (isAllowed) => {
    Allowed = isAllowed;
};

/** remove element */
module.exports.remove = (item, callback) => {
    if (Allowed)
        localStorage.removeItem(item);
    
    exec(callback, null, Allowed);
    
    return module.exports;
};

module.exports.removeMatch = (string, callback) => {
    const reg = RegExp('^' + string + '.*$');
    const test = (a) => reg.test(a);
    const remove = (a) => localStorage.removeItem(a);
    
    Object.keys(localStorage)
        .filter(test)
        .forEach(remove);
    
    exec(callback);
    
    return module.exports;
};

/** если доступен localStorage и
 * в нём есть нужная нам директория -
 * записываем данные в него
 */
module.exports.set = (name, data, callback) => {
    let str, error;
    
    if (itype.object(data))
        str = jonny.stringify(data);
    
    if (Allowed && name)
        error = exec.try(() => {
            localStorage.setItem(name, str || data);
        });
    
    exec(callback, error);
    
    return module.exports;
},

/** Если доступен Storage принимаем из него данные*/
module.exports.get = (name, callback) => {
    let ret;
    
    if (Allowed)
        ret = localStorage.getItem(name);
    
    exec(callback, null, ret);
    
    return module.exports;
},

/** функция чистит весь кэш для всех каталогов*/
module.exports.clear = (callback) => {
    const ret = Allowed;
    
    if (ret)
        localStorage.clear();
    
    exec(callback, null, ret);
    
    return module.exports;
};

