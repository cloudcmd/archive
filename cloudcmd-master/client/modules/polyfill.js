'use strict';

/* global Util, DOM, $ */

const itype = require('itype/legacy');

if (!window.XMLHttpRequest || !document.head)
    DOM.load.ajax = $.ajax;

/* setting head ie6 - ie8 */
if (!document.head)
    document.head = $('head')[0];

if (!Function.bind)
    Function.prototype.bind = function (context) {
        var aArgs   = [].slice.call(arguments, 1),
            fToBind = this,
            NOP     = function () {},
            fBound  = function () {
                var arr     = [].slice.call(arguments),
                    args    = aArgs.concat(arr);
                
                return fToBind.apply(context, args);
            };
        
        NOP.prototype = this.prototype;
        fBound.prototype = new NOP();
        
        return fBound;
    };

if (!Array.isArray)
    Array.isArray = itype.array.bind();

if (!document.addEventListener)
    /**
     * safe add event listener on ie
     * @param pType
     * @param pListener
     */
    DOM.Events.add = (pType, element, listener) => {
        return $(element || window).bind(itype, null, listener);
    };

if (!document.removeEventListener) {
    DOM.Events.remove = (pType, pElement, pListener) => {
        if (!pElement)
            pElement = window;
        
        $(pElement).unbind(pType, pListener);
    };
}

if (!document.getElementsByClassName) {
    DOM.getByClassAll = (className, el) => {
        const selector = '.' + className;
        
        if (el)
            return $(el).find(selector);
        
        return $.find(selector);
        
    };
}

/* function polyfill webkit standart function
 *    https://gist.github.com/2581101
 */
DOM.scrollIntoViewIfNeeded = function(element, centerIfNeeded) {
    var parent,
        topWidth,
        leftWidth,
        parentComputedStyle,
        parentBorderTopWidth,
        parentBorderLeftWidth,
        overTop,
        overBottom,
        overLeft,
        overRight,
        alignWithTop;
    
    if (window.getComputedStyle) {
        if (arguments.length === 1)
            centerIfNeeded = false;
        
        parent                  = element.parentNode;
        parentComputedStyle     = window.getComputedStyle(parent, null);
        
        topWidth                = parentComputedStyle.getPropertyValue('border-top-width');
        leftWidth               = parentComputedStyle.getPropertyValue('border-left-width');
        
        parentBorderTopWidth    = parseInt(topWidth, 10);
        parentBorderLeftWidth   = parseInt(leftWidth, 10);
            
        overTop                 = element.offsetTop - parent.offsetTop < parent.scrollTop,
        overBottom              =
            (element.offsetTop         -
                parent.offsetTop        +
                element.clientHeight   -
                parentBorderTopWidth)   >
            (parent.scrollTop + parent.clientHeight),
            
        overLeft                = element.offsetLeft -
            parent.offsetLeft < parent.scrollLeft,
            
        overRight               =
            (element.offsetLeft        -
                parent.offsetLeft       +
                element.clientWidth    -
                parentBorderLeftWidth)  >
            (parent.scrollLeft + parent.clientWidth),
        
        alignWithTop            = overTop && !overBottom;
        
        if ((overTop || overBottom) && centerIfNeeded)
            parent.scrollTop    =
                element.offsetTop      -
                parent.offsetTop        -
                parent.clientHeight / 2 -
                parentBorderTopWidth    +
                element.clientHeight / 2;
        
        if ((overLeft || overRight) && centerIfNeeded)
            parent.scrollLeft   =
                element.offsetLeft     -
                parent.offsetLeft       -
                parent.clientWidth / 2  -
                parentBorderLeftWidth   +
                element.clientWidth / 2;
        
        if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded)
            element.scrollIntoView(alignWithTop);
    }
};

if (!window.JSON) {
    window.JSON = {};
    
    window.JSON.parse = $.parseJSON;
    
    /* https://gist.github.com/754454 */
    window.JSON.stringify   = function(obj) {
        var n, v, has,
            ret     = '',
            value   = '',
            json    = [],
            isStr   = itype.string(obj),
            isObj   = itype.object(obj),
            isArray = itype.array(obj);
        
        if (!isObj || obj === null) {
            // simple data type
            if (isStr)
                obj = '"' + obj + '"';
            
            ret += obj;
        } else {
            // recurse array or object
            for (n in obj) {
                v   = obj[n];
                has = obj.hasOwnProperty(n);
                
                if (has) {
                    isStr   = itype.string(v);
                    isObj   = itype.object(v);
                    
                    if (isStr)
                        v   = '"' + v + '"';
                    else if (v && isObj)
                        v   = Util.json.stringify(v);
                    
                    if (!isArray)
                        value   = '"' + n + '":';
                    
                    json.push(value + v);
                }
            }
            
            if (isArray)
                ret = '[' + json + ']';
            else
                ret = '{' + json + '}';
        }
        
        return ret;
    };
}

