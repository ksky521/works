(function(window, document, undefined) {
    var id = Date.now();
    var Sprite = function(data) {
        //名称
        this.name = data.name;
        //唯一标识ID
        this.id = 'sprite' + (id++);
        this.frames = data.frames;
        this.isLive = true;
        this.collided = false;
        this.curAnimate = data.curAnimate || 'fly';
        this.init();
    }
    Sprite.prototype = {
        constructor: Sprite,
        imgURL: './img/gameArts.png',
        canDestroy: function() {
            return !this.isLive;
        },
        init: function() {

            //最后update 帧时间
            this.lastTime = 0;
            //当前动画第几步
            this.curAniStep = 0;
            //当前动画播放次数
            this.curAniPlayTimes = 0;
            this.setAni(this.curAnimate);

            var img = new Image();
            img.src = this.imgURL;

            this.img = img;
        },
        update: function(ctx, stage) {
            var arr = this.getUpdateData();
            if (arr) {
                ctx.drawImage.apply(ctx, arr);
            }
        },
        out: function(){
            this.isLive = false;
            return false;
        },
        //返回canvas绘图数组
        getUpdateData: function() {
            var arr = [this.img];
            var framesData = this.curAniFrameData;

            var len = framesData.length;
            if (this.curAniStep === len) {
                this.curAniStep = 0;
                this.curAniPlayTimes++;
                if (this.curAniMaxTimes !== 0 && this.curAniPlayTimes >= this.curAniMaxTimes) {
                    this.isLive = false;
                    // console.log(this.curAniPlayTimes, this.curAniMaxTimes, this.curAniStep);
                    return false;
                }
            }

            var data = framesData[this.curAniStep];

            this.y += this.speedY;
            this.x += this.speedX;
            //计算边境，用于判断是否超出边境范围
            var top = this.y;
            var left = this.x;
            var right = this.x + this.width;
            var bottom = this.y + this.height;

            if (top > this.stageHeight || bottom < 0 || right > this.stageWidth || left < 0) {
                //超出边境
                if(!this.out()){
                    return false;
                }
            }
            arr = arr.concat(data, [this.x, this.y], data.slice(-2));

            var now = Date.now();
            var dur = now - this.lastTime;
            var stepTime = this.aniStepTime;

            if (dur < stepTime) {
                //不改变当前帧

            } else {
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
        setAni: function(name) {
            if (this.curAnimate === name && this.curAniStep != 0) {
                return this;
            }
            //当前动画名次
            this.curAnimate = name;
            //当前动画data
            this.curAniFrameData = this.frames[name].data;
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
    }
    window.Sprite = Sprite;
}(window, document));