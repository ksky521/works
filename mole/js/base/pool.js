/**
 * 对象池
 * 使用对象池，可以将sprite提前实例化，放入对象池
 * 每次使用直接从pool取出，优化游戏性能
 * @author  wangyongqing01
 * @version  $Id: pool.js 175996 2014-05-16 00:48:03Z wangyongqing01 $
 */
var Pool = function(creator, opts) {
    if (typeof creator !== 'function') {
        throw 'Pool need creator as a constructor';
    }
    this.creator = creator;
    this.min = opts.min || 4;
    this.max = opts.max || 10;
    this.free = [];
    this.busy = [];

    this.init();
};

Pool.prototype = {
    constructor: Pool,
    addFree: function(o) {
        this.free.push(o);
        return this;
    },
    init: function() {
        var creator = this.creator,
            min = this.min,
            max = this.max;
        for (var i = 0; i < max; i++) {
            this.free.push(creator());
        }
    },
    //释放某个对象
    freeOne: function(obj) {
        var index = this.busy.indexOf(obj);
        if (index > -1) {
            this.busy.splice(index, 1);
            if (typeof obj.init === 'function') {
                //重新初始化
                obj.init();
            }
            this.free.push(obj);
        }
    },
    getRandomOne: function() {
        if (this.free.length > 0) {
            var arr = this.free;
            var t = (Math.random() * (arr.length - 2)) | 0;
            var obj = this.free.splice(t, 1)[0];

            this.busy.push(obj);
            return obj;
        } else {
            var newObj = this.creator();
            newObj.startBusyTime = new Date();
            this.busy.push(newObj);
            return newObj;
        }
    },
    //获取一个新对象
    getOne: function() {
        if (this.free.length > 0) {
            var obj = this.free.pop();

            this.busy.push(obj);
            return obj;
        } else {
            var newObj = this.creator();
            newObj.startBusyTime = new Date();
            this.busy.push(newObj);
            return newObj;
        }
    },
    destroy: function() {
        this.free.length = 0;
        this.busy.length = 0;
        this.creator = null;
        for (var i in this) {
            if (this.hasOwnProperty(i)) {
                delete this[i];
            }
        }
    }
};
