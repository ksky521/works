/**
 * 游戏精灵类(图片版)
 * author wangyongqing01
 * $Id: sprite.js 175996 2014-05-16 00:48:03Z wangyongqing01 $
 */

(function(window, document, undefined) {
    if (!Date.now) {
        Date.now = function() {
            return (new Date()).getTime();
        };
    }
    var emtpyFn = function() {};
    var id = Date.now();
    var Sprite = function(name, data) {
        //名称
        this.name = name;

        if (typeof data.img === 'string') {
            var img = new Image();
            img.src = data.img;
            this.img = img;
        } else {
            this.img = data.img;
        }
        this.handleFn = typeof data.handleFn === 'function' ? data.handleFn : emtpyFn;
        // 大小
        this.width = data.width;
        this.height = data.height;
        this.origin = 'leftTop'; //原点位置
        this.dx = 0;
        this.dy = 0;
        this.speedX = 0;
        this.speedY = 0;
        //唯一标识ID
        this.id = 'sprite' + (id++);
        this.timeout = data.timeout || 3000;
        this.frames = data.frames;
        this.isLive = true;
        this.curAnimate = data.curAnimate || 'normal';
        var self = this;
        this.g = data.g || 1;
        this.isNextFrame = typeof data.isNextFrame === 'function' ? function() {
            data.isNextFrame.call(self);
        } : function() {
            var now = Date.now();
            var dur = now - this.lastTime;
            dur *= self.g;
            var stepTime = this.aniStepTime;
            return dur >= stepTime;
        };
        this.init();
    };
    Sprite.prototype = {
        constructor: Sprite,
        canDestroy: function() {
            return !this.isLive;
        },

        init: function(ani) {
            this.isLive = true;
            this.duration = 0;
            this.now = Date.now();
            //最后update 帧时间
            this.lastTime = 0;
            //当前动画第几步
            this.curAniStep = 0;
            //当前动画播放次数
            this.curAniPlayTimes = 0;
            // this.setAni(ani || this.curAnimate);
            return this;
        },
        evtClick: function() {

        },
        update: function(ctx, stage) {
            var arr = this.getUpdateData();
            var now = this.now;
            this.now = Date.now();
            this.duration += this.now - now;

            if (arr) {
                ctx.drawImage.apply(ctx, arr);
            }
            //是否到期
            if (this.isTimeout()) {
                this.isLive = false;
            }
        },
        isTimeout: function() {
            return this.duration > this.timeout;
        },
        //返回canvas绘图数组
        getUpdateData: function() {
            var arr = [this.img];
            var framesData = this.curAniFrameData;
            var now = Date.now();
            var len = framesData.length;
            if (this.curAniStep === len) {
                this.curAniStep = 0;
                this.curAniPlayTimes++;
                if (this.curAniMaxTimes !== 0 && this.curAniPlayTimes === this.curAniMaxTimes) {
                    if (this.nextAni()) {
                        framesData = this.curAniFrameData;
                    } else {
                        this.isLive = false;
                        return false;
                    }
                }
            }
            this.handleFn(this, framesData[this.curAniStep]);
            var data = framesData[this.curAniStep].slice(0);
            this.y += this.speedY;
            this.x += this.speedX;
            var tdxy = data.slice(-2);
            this.dx = tdxy[0] / -2;
            this.dy = tdxy[1] / -2;

            data.splice(4, 0, this.x + this.dx, this.y + this.dy);
            arr = arr.concat(data);

            if (this.isNextFrame.call(this)) {
                //进入下一帧动画
                this.curAniStep++;
                this.lastTime = now;
            }
            return arr;
        },
        setFPS: function(fps) {
            this.fps = fps;
            this.aniStepTime = 1000 / fps;
            return this;
        },
        //设置frames
        setFrames: function(frames) {
            this.frames = frames;
            return this;
        },
        setAni: function(name) {
            if (this.curAnimate === name && this.curAniStep !== 0) {
                return this;
            }
            //当前动画名次
            this.curAnimate = name;
            //当前动画data
            var curData = this.curAniFrameData = this.frames[name].data;

            var data;
            for (var i = 0, len = curData.length; i < len; i++) {
                data = curData[i];

                curData[i] = data.length === 4 ? data.concat(data.slice(-2)) : data;
            }
            //设置当前动画的fps
            this.setFPS(this.frames[name].fps);
            //当前动画的帧清零
            this.curAniStep = 0;
            //当前动画的播放次数清零
            this.curAniPlayTimes = 0;
            //当前动画可以播放的最大次数
            this.curAniMaxTimes = this.frames[name].times;
            return this;
        },
        stopMove: function() {
            this.speedX = 0;
            this.speedY = 0;
            return this;
        },
        setAccelerate: function(s) {
            this.g = s | 0;
            return this;
        },
        setSpeed: function(x, y) {
            this.speedX = x;
            this.speedY = y;
            return this;
        },
        setSpeedX: function(x) {
            this.speedX = x;
            return this;
        },
        setSpeedY: function(y) {
            this.speedY = y;
            return this;
        },
        setXY: function(x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        setX: function(x) {
            this.x = x;
            return this;
        },
        setY: function(y) {
            this.y = y;
            return this;
        },
        destroy: function() {
            // console.log(this.name);
            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    if (this[i] && (typeof this[i].destroy === 'function')) {
                        this[i].destroy();
                    }
                    this[i] = null;
                    delete this[i];
                }
            }
        }
    };
    window.Sprite = Sprite;
}(window, document));
