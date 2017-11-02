function Plane(opt) {
    this.stageWidth = opt.stageWidth;
    this.stageHeight = opt.stageHeight;
    this.speedX = 0;
    this.speedY = 0;
    this.x = opt.x || 130;
    this.y = opt.y || 400;
    this.width = opt.width || 66;
    this.height = opt.height || 80;
    //最后子弹发送的时间
    this.lastBulletTime = 0;
    //子弹间隔300ms
    this.bulletInterval = 300;
}

Plane.prototype = new Sprite({
    name: 'Plane',
    frames: {
        fly: {
            fps: 5,
            times: 0,
            data: [
                [432, 332, 66, 80],
                [432, 0, 66, 82]
            ]
        },
        fire: {
            fps: 8,
            times: 1,
            data: [
                [432, 249, 66, 82],
                [432, 83, 66, 82],
                [432, 166, 66, 82]
            ]
        }
    }
});

Plane.prototype.constructor = Plane;
Plane.prototype.update = function(ctx, stage) {
    var arr = this.getUpdateData();
    if (arr) {
        var now = Date.now();
        ctx.drawImage.apply(ctx, arr);
        if ((now - this.lastBulletTime) > this.bulletInterval) {
            this.lastBulletTime = now;
            this.sendBullet(stage);
            // console.log(111);
        }
    }
};
Plane.prototype.out = function() {

    return true;
};
Plane.prototype.sendBullet = function(stage) {
    if(this.collided){
        return this;
    }
    var self = this;
    var bullet = new Bullet({
        stageHeight: self.stageHeight,
        stageWidth: self.stageWidth,
        x: self.x + self.width / 2 - 2,
        y: self.y - 15
    });
    stage.addSprite(bullet);
    return this;
};