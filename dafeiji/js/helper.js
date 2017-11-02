var emptyArr = [];
var emptyFn = function() {};
var m = Math;
var getComputedStyle = document.defaultView.getComputedStyle;

function extend(P, C){
    var fn = function(){};
    fn.prototype = P.prototype;
    C.prototype = new fn();
    C.prototype.constructor = C;
    console.log(new C({}));
}

function stopEvent(e) {
    e.preventDefault();
    e.stopPropagation();
}

function getStyle(node, property) {

    return node.style[property] || getComputedStyle(node, '').getPropertyValue(property);
}

function getOffset(node) {
    var obj = node.getBoundingClientRect()
    return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
    }
}
//封装选择器

function $(selector, context) {
    context = (context && context.nodeType === 1) ? context : document;
    return context.querySelectorAll(selector);
}
//getID方法

function $$(id) {
    return document.getElementById(id);
}

function toArray(arrayLike) {
    return emptyArr.slice.call(arrayLike);
}
var isArray = Array.isArray?Array.isArray:function(obj){
    Object.prototype.toString.call(obj).slice(8, -1) === 'Array';
}

function prefixStyle(style) {
    if (vendor === '') {
        return style;
    }

    style = style.charAt(0).toUpperCase() + style.substr(1);
    return vendor + style;
}

function random(min, max) {
    var m = Math;
    return (m.random() * (max - min + 1) + min) | 0;
}