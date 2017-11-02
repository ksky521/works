/**
 * 游戏舞台类
 * 因为是手机上面游戏，特殊处理了touch事件
 * author wangyongqing01
 * $Id: stage.js 175996 2014-05-16 00:48:03Z wangyongqing01 $
 */
(function(window, document, undefined) {
    function stopEvent(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function getOffset(node) {
        var obj = node.getBoundingClientRect();
        return {
            left: obj.left + window.pageXOffset,
            top: obj.top + window.pageYOffset,
            width: Math.round(obj.width),
            height: Math.round(obj.height)
        };
    }
    var clearObj = {},
        $ = {
            stopEvent: function(e) {
                e.preventDefault();
                e.stopPropagation();
            },
            timestamp: Date.now ? Date.now : function() {
                return (new Date()).getTime();
            },
            getOffset: function(node) {
                var obj = node.getBoundingClientRect();
                return {
                    left: obj.left + window.pageXOffset,
                    top: obj.top + window.pageYOffset,
                    width: Math.round(obj.width),
                    height: Math.round(obj.height)
                };
            },
            isFunction: function(fn) {
                return typeof fn === 'function';
            },
            isString: function(str) {
                return typeof str === 'string';
            },
            isArray: function(arr) {
                return clearObj.toString.call(arr).slice(8, -1) === 'Array';
            }
        };

    var Stage = function(canvasId, width, height, factory) {
        this.sprites = [];
        var canvas = this.canvas = $.isString(canvasId) ? document.getElementById(canvasId) : canvasId;
        this.width = width || canvas.width;
        this.height = height || canvas.height;
        this.ctx = canvas.getContext('2d');
        this.init();
        if ($.isFunction(factory)) {
            factory(this);
        }
    };
    Stage.prototype = {
        constructor: Stage,
        random: function(min, max) {
            return (Math.random() * (max - min + 1) + min) | 0;
        },
        bindEvent: function() {
            this.bind('touchstart', this);
        },
        init: function() {
            this.timeData = [];
            this.evts = {};
            this.reset();
            this.bindEvent();
            return this;
        },
        start: function() {
            this.reset().play();

            return this;
        },
        pause: function() {
            this.status = 'pause';
            var now = $.timestamp();
            this.duration += now - this.now;
            this.fire('pause', msg);
            this.handleSprite('pause');
            return this;
        },
        //控制sprite行为
        handleSprite: function(evt) {
            if (!evt) {
                return this;
            }
            var sprites = this.sprites,
                sprite;
            for (var i = 0, len = sprites.length; i < len; i++) {
                sprite = sprites[i];
                if ($.isFunction(sprite[evt])) {
                    sprite[evt]();
                }
            }
            return this;
        },
        play: function(msg) {
            this.status = 'play';
            var now = this.now = $.timestamp();
            //精灵初始化
            var sprites = this.sprites,
                sprite;

            for (var i = 0, len = sprites.length; i < len; i++) {
                sprite = sprites[i];
                sprite.now = now;
            }

            this.fire('play', msg);
            this.update();
            return this;
        },
        stop: function(msg) {
            this.status = 'stop';
            this.timeData.length = 0;
            this.fire('stop', msg);
            this.clearRect();
            return this;
        },
        update: function() {
            if (this.status !== 'play') {
                return this;
            }
            this.fire('beforeUpdate', [this.ctx, this]);

            var self = this;
            this.clearRect();
            var now = this.now;
            this.now = $.timestamp(); //js时间戳，Date.now();
            var time = this.duration += this.now - now;

            var timeData = this.timeData;
            //处理timeline
            for (var i = 0, len = timeData.length; i < len; i++) {
                var data = timeData[i];
                if (data.startActive && time >= data.startTime && time <= data.endTime) {
                    //执行
                    $.isFunction(data.beforeStart) && data.beforeStart(data);
                    data.startActive = false;
                } else if (data.endActive && time > data.endTime) {
                    //结束事件
                    $.isFunction(data.afterEnd) && data.afterEnd(data);
                    data.endActive = false;
                }
            }

            var ctx = this.ctx,
                sprites = this.sprites,
                sprite;
            // 处理精灵类
            for (i = 0, len = sprites.length; i < len; i++) {
                sprite = sprites[i];

                if (sprite.canDestroy()) {
                    self.removeSprite(sprite);
                    i--;
                    len--;
                } else {
                    sprite.update(ctx, self);
                }
            }

            this.fire('update', [ctx, this]);
            return this;
        },
        //添加精灵
        addSprite: function(sprite) {
            if (!~this.sprites.indexOf(sprite)) {
                this.sprites.push(sprite);
            }
            return this;
        },
        //移除精灵
        removeSprite: function(sprite) {
            var index = this.sprites.indexOf(sprite);
            !!~index && this.sprites.splice(index, 1);
            return this;
        },
        //添加score
        addScore: function(score) {
            this.score += score;
            return this;
        },
        timeline: function(obj) {
            obj.startActive = true; //可用，活跃状态
            obj.endActive = true;
            this.timeData.push(obj);
            return this;
        },
        clearRect: function() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            return this;
        },
        getScore: function() {
            return this.score;
        },
        reset: function() {
            this.score = 0; //得分
            this.duration = 0; //持续时间
            this.clearRect();
            this.status = 'pending';

            var timeData = this.timeData;
            //时间线清掉
            for (var i = 0, len = timeData.length; i < len; i++) {
                timeData[i].startActive = true;
                timeData[i].endActive = true;
            }
            this.timeData.length = 0;
            this.sprites.length = 0;
            return this;
        },
        //绑定自定义事件
        on: function(type, callback, scope, args) {
            var cType = typeof callback;
            var cb = function() {};
            scope = scope || window;
            args = $.isArray(args) ? args : [args];
            switch (cType) {
                case 'function':
                    cb = callback;
                    break;
                case 'object':
                    if (typeof callback.update === 'function') {
                        scope = callback;
                        cb = callback.update;
                    }
                    break;
            }
            this.evts[type] = this.evts[type] || [];
            var obj = {
                fn: cb,
                scope: scope,
                args: args,
                _cb: callback
            };
            this.evts[type].push(obj);
            return this;
        },
        //解除绑定
        off: function(type, callback) {
            var evts = this.evts[type],
                len;
            if (!evts || !(len = evts.length)) {
                return this;
            }
            var cType = typeof callback;
            var attr = 'fn';
            switch (cType) {
                case 'function':
                    break;
                case 'object':
                    attr = '_cb';
                    break;
            }
            for (var i = 0; i < len; i++) {
                if (evts[i][attr] === callback) {
                    evts.splice(i--, 1);
                    len--;
                }
            }
            return this;
        },
        //触发事件
        fire: function(type, args, scope) {
            if (this.status !== 'play' && type !== this.status) {
                return this;
            }

            var evts = this.evts[type];
            if (evts && evts.length > 0) {
                if (type === 'touchstart') {
                    var touches = args.touches[0];
                    if (!touches) {
                        return;
                    }
                    var offset = $.getOffset(this.canvas);
                    args.x = touches.pageX - offset.left;
                    args.y = touches.pageY - offset.top;
                }
                args = $.isArray(args) ? args : [args];
                for (var i = 0, len = evts.length; i < len; i++) {
                    var obj = evts[i];
                    if (!obj) {
                        continue;
                    }
                    var fn = obj.fn,
                        arg = obj.args;
                    scope = obj.scope || window;
                    arg = args.concat(arg);
                    fn.apply(scope, arg);
                }
            }
            return this;
        },
        //事件绑定统一入口
        handleEvent: function(e) {
            var type = e.type;
            switch (type) {
                case 'touchstart':
                    stopEvent(e);
                    this.touchstart(e);
                    break;
            }
            $.isFunction(this[type]) && this[type](e);
            var evts = this.evts[type];
            if (evts && evts.length > 0) {
                this.fire(type, e);
            }
        },
        touchstart: function(e) {
            if (this.status !== 'play') {
                return this;
            }
            var clicked = false,
                args = {},
                self = this;
            var offset = getOffset(this.canvas);
            var cTouches = e.changedTouches;
            var touches;
            for (var j = 0, len = cTouches.length; j < len && (touches = cTouches[j]); j++) {
                args.x = touches.pageX - offset.left;
                args.y = touches.pageY - offset.top;
                var sprites = this.sprites,
                    sprite;
                // 处理精灵类
                for (var i = 0, len = sprites.length; i < len; i++) {
                    sprite = sprites[i];

                    if (!sprite.canDestroy()) {
                        clicked = sprite.evtClick(args, self);
                        if (clicked) {
                            break;
                        }
                    }
                }
            }


            return clicked;
        },
        //绑定DOM事件
        bind: function(type, fn) {
            var temp = typeof fn;
            if (temp === 'function' || temp === 'object') {
                this._bind(this.canvas, type, fn, true);
            }
            return this;
        },
        unbind: function(type, fn) {
            var temp = typeof fn;
            if (temp === 'function' || temp === 'object') {
                this._unbind(this.canvas, type, fn, true);
            }
            return this;
        },
        _bind: function($node, type, fn, capture) {
            $node.addEventListener(type, fn, typeof capture === 'boolean' ? capture : false);
            return this;
        },
        _unbind: function($node, type, fn, capture) {
            $node.removeEventListener(type, fn, typeof capture === 'boolean' ? capture : false);
            return this;
        },
        getDurationTime: function() {
            return this.duration;
        },
        destroy: function() {
            for (var i in this) {
                if ($.isFunction(this[i].destroy)) {
                    this[i].destroy(this);
                } else if ($.isArray(this[i])) {
                    this[i].forEach(function(v) {
                        v && $.isFunction(v.destroy) && v.destroy();
                    });
                    this[i].length = 0;
                }

                if (this.hasOwnProperty(i)) {
                    delete this[i];
                }
            }
        }
    };
    window.Stage = Stage;
}(window, document));
