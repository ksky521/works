// Polyfill - requestAnimationFrame - only basic shim as very old browsers don't support getUserMedia anyway (from http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
var emptyFn = function() {};



function Camera(video, canvas, loop) {
    this.video = video;
    this.stream = null;
    this.canvas = canvas;
    if (this.canvas) {
        this.ctx = canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.loopCB = typeof loop === 'function' ? loop : emptyFn;
    }
}
Camera.prototype = {
    init: function() {
        this.getUserMedia();

    },
    loop: function() {

        if (this.video) {
            var that = this;
            requestAnimationFrame(function() {
                that.loop();
            });
            this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
            this.loopCB();
        }
    },
    getUserMedia: function() {
        var that = this;
        var success = function(stream) {
            that.stream = stream;
            if (navigator.getUserMedia == navigator.mozGetUserMedia) {
                that.video.src = stream;
            } else {
                that.video.src = window.URL.createObjectURL(stream) || stream;
            }
            that.video.play();
            if (that.canvas) {
                that.loop()
            }
        }
        try {
            navigator.getUserMedia({
                video: true,
                audio: false
            }, success, function() {
                alert('出现问题，或者不支持getUserMedia');
            });
        } catch (e) {
            try {
                navigator.getUserMedia('video', success, function() {
                    alert('出现问题，或者不支持getUserMedia');
                });
            } catch (e) {}
        }
    },
    stop: function() {
        this.stream.stop && this.stream.stop();
        this.video = null;
        this.canvas = null;
    }
};


var v = document.createElement('video');
var c = document.createElement('canvas');
var bak = document.createElement('canvas');

var ctx = c.getContext('2d');
var bakCtx = bak.getContext('2d');

var width = 640;
var height = 480;
c.width = width;
c.height = height;
bak.height = height;
bak.width = width;
var camera = new Camera(v, c, loop);
camera.init();
init();
v.addEventListener('play', ready, false);

function ready() {

    c.style.marginLeft = (-width / 2) + 'px';
    bak.style.marginLeft = (-width / 2) + 'px';
    document.body.appendChild(c);
    document.body.appendChild(bak);
}

function init() {
    c.style.position = 'fixed';
    c.style.left = '50%';
    c.style.top = '10px';
    c.style.zIndex = 1;
    bak.style.position = 'fixed';
    bak.style.left = '50%';
    bak.style.top = '10px';
    bak.style.zIndex = 10;
}
var lastImg;

function loop() {
    var current = ctx.getImageData(0, 0, width, height);
    if (lastImg) {

        var imgData = bakCtx.createImageData(width, height);
        getDiff(lastImg, current, imgData);


        bakCtx.putImageData(imgData, 0, 0);
    }
    lastImg = current;
}

function getDiff(a, b, imageData) {
    var data1 = a.data;
    var data2 = b.data;
    var average1, average2, diff;
    var arr = imageData.data || imageData;

    for (var i = 0, len = data1.length; i < len; i += 4) {


        average1 = (data1[i] * 4899 + data1[i + 1] * 9617 + data1[i + 2] * 1868 + 8192) >> 14;
        average2 = (data2[i] * 4899 + data2[i + 1] * 9617 + data2[i + 2] * 1868 + 8192) >> 14;

        diff = threshold(fastAbs(average2 - average1));

        arr[i] = diff;
        arr[i + 1] = diff;
        arr[i + 2] = diff;
        arr[i + 3] = diff;
        // arr[i + 3] = diff > 0 ? 100 : 0;
    }
    return imageData;
}

function fastAbs(value) {
    // equivalent to Math.abs();
    return (value ^ (value >> 31)) - (value >> 31);
}

function threshold(value) {
    return (value > 21) ? 255 : 0;
}


function motionDecetion(lastimg, current, imgData) {
    var w = imgData.width;
    var h = imgData.height;
    var data = imgData.data;
    var noblocks = 16;
    var dw = parseInt(w / noblocks),
        dh = parseInt(w / noblocks);
    var blocks = new Uint8ClampedArray(noblocks * noblocks);
    for (var i = 0; i < noblocks; i++) {
        for (var j = 0; j < noblocks; j++) {
            var sum = 0;
            for (var ii = dw * i; ii < dw * (i + 1); ii++) {
                for (var jj = dh * j; jj < dh * (j + 1); jj++) {
                    // Euclidien distance nomalised to [0,255]
                    sum += that.abs(lastimg.data[4 * (w * jj + ii)] - current.data[4 * (w * jj + ii)]) + that.abs(lastimg.data[4 * (w * jj + ii) + 1] - current.data[4 * (w * jj + ii) + 1]) + that.abs(lastimg.data[4 * (w * jj + ii) + 2] - current.data[4 * (w * jj + ii) + 2]);
                }
            }

            // max of sum = 256*noblocks^2
            blocks[noblocks * i + j] = Math.min(255, (2 * sum) / (3 * noblocks * noblocks));
        }
    }
    return imgData;
}