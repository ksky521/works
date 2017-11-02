(function(window, document, undefined) {
    function Stage(canvasID, obj) {
        var canvas = this.canvas = typeof canvasID === 'string' ? document.getElementById(canvasID) : canvasID;
        this.ctx = canvas.getContext('2d');
        if (obj.width && obj.height) {
            this.width = obj.width;
            this.height = obj.height;
            canvas.width = obj.width;
            canvas.height = obj.height;
        } else {
            this.width = canvas.width;
            this.height = canvas.height;
        }
        this.evts = {}; //事件集合

        //sprites
        this.sprites = [];

        //状态,pending,play, pause,stop
        this.status = 'pending';

        this.score = 0; //得分

        //游戏持续时间
        this.durtion = 0;
        this.init();
    }
    Stage.prototype = {
        constructor: Stage,
        //初始化
        init: function() {
            this.status = 'play';
            this.now = Date.now();
        },
        addScore: function(score) {
            this.score += score;
            return this;
        },
        //添加精灵
        addSprite: function(sprite) {
            if (this.sprites.indexOf(sprite) === -1) {

                this.sprites.push(sprite);
            }
            return this;
        },
        //移除精灵
        removeSprite: function(sprite) {
            // console.log(this.sprites.indexOf(sprite));
            this.sprites.splice(this.sprites.indexOf(sprite), 1);
            return this;
        },
        //更新动画
        update: function() {
            if (this.status !== 'play') {

                return this;
            }
            //清除画布
            this.clearRect();
            var now = this.now;
            this.now = Date.now();
            var time = (this.durtion += this.now - now);

            var ctx = this.ctx;
            var self = this;

            var sprites = this.sprites;
            var sprite;

            var bullets = [];
            var enemys = [];
            var planes = [];
            for (var i = 0, len = sprites.length; i < len; i++) {

                sprite = sprites[i];
                if (sprite.collided) {
                    continue;
                }
                if (sprite.canDestroy()) {

                    sprite.destroy();
                    self.removeSprite(sprite);
                    i--;
                    len--;
                    if (sprite.name === 'Plane') {
                        // alert('Game Over');
                    }
                } else {
                    switch (sprite.name) {
                        case 'Enemy':
                            enemys.push(sprite);
                            break;
                        case 'Bullet':
                            bullets.push(sprite);
                            break;
                        case 'Plane':
                            planes.push(sprite);
                            break;
                    }
                    sprite.update(ctx, self);
                }
            }
            this.checkPlaneAndEnemy(enemys, planes);
            this.checkCollide(enemys, bullets);

            this.fire('update', [ctx, this]);
            //清空，释放内存
            enemys.length = 0;
            bullets.length = 0;
            enemys = null;
            bullets = null;
            return this;
        },
        checkPlaneAndEnemy: function(enemys, planes) {
            if (!planes.length) {
                // this.stop();
                // alert('game over');
                return;
            }
            var plane = planes[0]; //因为只有一个飞机，所以就不用循环了
            var pLeft = plane.x,
                pTop = plane.y,
                pRight = pLeft + plane.width,
                //飞机头部右侧
                pHeadRight = pLeft + plane.width / 2 + 10,
                pHeadLeft = pLeft + plane.width / 2 - 10,

                pBottom = pTop + plane.height;

            for (var i = 0, l = enemys.length; i < l; i++) {
                var enemy = enemys[i];
                if (enemy.collided || plane.collided) {
                    //已经碰撞了
                    break;
                }
                var left = enemy.x,
                    top = enemy.y,
                    right = left + enemy.width,
                    bottom = enemy.y + enemy.height;

                if (pLeft > right || pRight < left || pTop > bottom || pBottom < top) {
                    // console.log(222);

                } else {
                    if ((bottom - pTop) < 26 && (pHeadRight < left || pHeadLeft > right)) {
                        
                    }else{
                        enemy.setAni('fire');
                        plane.setAni('fire');
                    }

                }
            }
        },
        checkCollide: function(enemys, bullets) {
            for (var j = 0, ll = bullets.length; j < ll; j++) {
                var bullet = bullets[j];
                var x = bullet.x;
                var y = bullet.y;
                var y2 = y + bullet.speedY;
                for (var i = 0, l = enemys.length; i < l; i++) {

                    var enemy = enemys[i];
                    if (enemy.collided) {
                        //已经碰撞了
                        break;
                    }
                    var left = enemy.x;
                    var right = left + enemy.width;
                    var bottom = enemy.y + enemy.height;
                    if (x >= left && x <= right) {
                        if (bottom > y || bottom > y2) {
                            enemy.hits--;
                            if (enemy.hits === 0) {
                                enemy.setAni('fire');
                            }
                            bullet.isLive = false;
                            // enemy.isLive = false;
                            break;
                        }
                    }

                }
            }

        },
        //清画布
        clearRect: function() {
            var ctx = this.ctx;
            ctx.clearRect(0, 0, this.width, this.height);
            //this.ctx.save();
            return this;
        },
        //触发事件
        fire: function(type, args, scope) {
            var evts = this.evts[type];
            if (evts && (evts.length > 0)) {

                args = isArray(args) ? args : (args ? [args] : []);
                for (var i = 0, len = evts.length; i < len; i++) {
                    var arr = evts[i];
                    var fn = arr[0],
                        arg = arr[1],
                        scope = arr[2] || window,
                        once = arr[3];
                    arg = args.concat(arg);
                    fn.apply(scope, arg);
                    if (once) {
                        evts.splice(i--, 1);
                        len--;
                    }
                }
            }
            return this;
        },
        //绑定事件
        on: function(type, fn, args, scope, once) {
            var temp = typeof fn;
            if (type) {
                var evts = this.evts;
                evts[type] = evts[type] || [];
                args = args || [];
                var arr;
                if (temp === 'function') {
                    arr = [fn, isArray(args) ? args : [args], scope || window, !! once];
                } else if (isArray(fn)) {
                    arr = fn;
                } else if (temp === 'object' && fn.update) {
                    arr = [fn.update, isArray(args) ? args : [args], fn, !! once];
                } else {
                    return this;
                }

                evts[type].push(arr);
            }
            return this;
        },
        //清除绑定的事件
        off: function(type, fn) {
            var temp = typeof fn;
            var isThis = (temp === 'object' && (update = fn.update) && fn !== window);
            var index = 0;
            if (isThis) {
                index = 2;
            }
            if ((temp === 'function' || isThis) && type) {
                var evts = this.evts[type];
                if (evts) {
                    for (var i = 0, len = evts.length; i < len; i++) {
                        if (evts[i][index] === fn) {
                            evts.splice(i--, 1);
                            len--;
                        }
                    }
                }
            }
            return this;
        },
        //开始播放
        play: function() {
            this.status = 'play';
            this.now = Date.now();
            this.update();
            return this;
        },
        //停止舞台动画
        stop: function(msg) {
            this.status = 'stop';
            this.fire('stop', msg);
            return this;
        },
        //暂停舞台动画
        pause: function(msg) {
            this.status = 'pause';
            this.fire('pause', msg);
            return this;
        },
        //绑定自定义事件
        bindEvent: function(type, fn) {
            var temp = typeof fn;
            if (temp === 'function' || temp === 'object') {
                this._bind(this.canvas, type, fn, true);
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
        destroy: function() {
            this.objects.forEach(function(o) {
                if (o && typeof o.destroy === 'function') {
                    o.destroy();
                }
            });
            this.objects.length = 0;
            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    delete this[i];
                }
            }
        }
    };
    window.Stage = Stage;


}(window, document));