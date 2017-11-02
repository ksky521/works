/**
 * requestAnimationFrame函数
 * author wangyongqing01
 * $Id: raf.js 175996 2014-05-16 00:48:03Z wangyongqing01 $
 */
(function(window) {
    if (window.requestAnimationFrame) {
        return;
    }
    var i = 0,
        lastTime = 0,
        vendors = ['webkit', 'moz', 'ms', 'o'],
        len = vendors.length;

    while (i < len && !window.requestAnimationFrame) {
        window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
        i++;
    }
    if (!window.requestAnimationFrame) {
        var fps = 60; //设置为60帧
        var everyTime = 1000 / fps;
        window.requestAnimationFrame = function(callback, element) {
            var currTime = Date.now(),
                timeToCall = Math.max(0, everyTime - currTime + lastTime),
                id = setTimeout(function() {
                    callback();
                }, timeToCall);

            lastTime = currTime + timeToCall;
            return id;
        };
        window.cancelAnimationFrame = function(id) {
            return clearTimeout(id);
        };
    }
}(window));
