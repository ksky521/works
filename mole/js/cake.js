var Cake = function(x, y, name, cakes, names) {
    this.x = x;
    this.y = y;
    this.duration = 0;
    this.cakes = cakes;
    this.names = names;
    this.setFrames(cakes[name]).init().setAni('enter');
    this.cname = name;
};
var img = new Image();
img.src = './img/sprite.png';
Cake.prototype = new Sprite('cake', {
    img: img,
    width: 82,
    height: 83,
    curAnimate: 'enter',
    frames: {}
});
Cake.prototype.reset = function(x, y, g) {
    // body...
    this.status = '';
    this.x = x;
    this.y = y;
    this.setAccelerate(g);
    this.setAni('enter');
    return this;
};
Cake.prototype.constructor = Cake;
Cake.prototype.evtClick = function(e, stage) {
    if (this.status === 'clicked') {
        return false;
    }
    var x = e.x,
        y = e.y;

    var x0 = this.x + this.dx;
    var y0 = this.y + this.dy;
    var x1 = this.x - this.dx;
    var y1 = this.y - this.dy;

    if (x > x0 && x < x1 && y > y0 && y < y1) {
        this.status = 'clicked';
        this.clickTime = Date.now();
        if (this.cname === 'wuren') {
            this.setAni('touch');
            // 分数加倍
            stage.addScore(1);
        } else {
            stage.stop('fail');
        }

        return true;
    }
    return false;
};
Cake.prototype.setXY = function(x, y) {

    return this;
};
Cake.prototype.nextAni = function() {
    if (this.curAnimate === 'enter') {
        this.setAni('normal');
        return true;
    }
    // if (this.curAnimate === 'normal') {
    //     this.setAni('outer');
    //     return true;
    // }
    // if (this.curAnimate === 'outer') {
    //     var names = this.names;
    //     var cakes = this.cakes;
    //     var r = random;
    //     var i = random(0, names.length - 1);
    //     this.name = names[i];
    //     this.setFrames(cakes[names[i]]).init().setAni('enter');
    //     return true;
    // }
    return false;
};
