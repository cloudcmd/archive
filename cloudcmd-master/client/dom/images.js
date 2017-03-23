/* global CloudCmd */

'use strict';

const DOM = require('./');

const Images = module.exports;

const LOADING = 'loading';
const HIDDEN = 'hidden';
const ERROR = 'error';

const LoadingImage = LOADING + getLoadingType();

function getLoadingType() {
    return isSVG() ? '-svg' : '-gif';
}

module.exports.get = getElement;

/**
 * check SVG SMIL animation support
 */
function isSVG() {
    const createNS = document.createElementNS;
    const SVG_URL = 'http://www.w3.org/2000/svg';
    
    if (!createNS)
        return false;
    
    const create = createNS.bind(document);
    const svgNode = create(SVG_URL, 'animate');
    const name = svgNode.toString();
    
    return /SVGAnimate/.test(name);
}


function getElement() {
    return DOM.load({
        name        : 'span',
        id          : 'js-status-image',
        className   : 'icon',
        attribute   : 'data-progress',
        notAppend   : true
    });
}

/* Функция создаёт картинку загрузки */
module.exports.loading = () => {
    const element = getElement();
    const classList = element.classList;
    
    classList.add(LOADING, LoadingImage);
    classList.remove(ERROR, HIDDEN);
    
    return element;
};

/* Функция создаёт картинку ошибки загрузки */
module.exports.error = () => {
    const element = getElement();
    const classList = element.classList;
    
    classList.add(ERROR);
    classList.remove(HIDDEN, LOADING, LoadingImage);
    
    return element;
};

module.exports.show = show;
module.exports.show.load  = show;
module.exports.show.error = error;

/**
* Function shows loading spinner
* position = {top: true};
*/
function show(position, panel) {
    const image = Images.loading();
    const parent = image.parentElement;
    const refreshButton = DOM.getRefreshButton(panel);
    
    let current;

    if (position === 'top') {
        current = refreshButton.parentElement;
    } else {
        current = DOM.getCurrentFile();
        
        if (current)
            current = DOM.getByDataName('js-name', current);
        else
            current = refreshButton.parentElement;
    }
    
    if (!parent || (parent && parent !== current))
        current.appendChild(image);
    
    DOM.show(image);
    
    return image;
}

function error(text) {
    const image = Images.error();
    
    DOM.show(image);
    image.title = text;
    
    CloudCmd.log(text);
    
    return image;
}

/**
* hide load image
*/
module.exports.hide = () => {
    const element = Images.get();
    
    DOM.hide(element);
    
    return Images;
};

module.exports.setProgress = (value, title) => {
    const DATA = 'data-progress';
    const element = Images.get();
     
    if (!element)
        return Images;
    
    element.setAttribute(DATA, value + '%');
    
    if (title)
        element.title = title;
    
    return Images;
};

module.exports.clearProgress  = () => {
    const DATA = 'data-progress';
    const element = Images.get();
    
    if (!element)
        return Images;
    
    element.setAttribute(DATA, '');
    element.title = '';
    
    return Images;
};

