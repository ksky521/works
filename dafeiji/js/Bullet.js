function Bullet(opt) {
    this.stageWidth = opt.stageWidth;
    this.stageHeight = opt.stageHeight;
    this.speedX = 0;
    this.speedY = -8;
    this.x = opt.x || 130;
    this.y = opt.y || 400;
    this.width = opt.width || 6;
    this.height = opt.height || 14;
    
}

Bullet.prototype = new Sprite({
    name: 'Bullet',
    frames: {
        fly: {
            fps: 5,
            times: 0,
            data: [
                [499, 0, 6, 14]
            ]
        }
    }
});

Bullet.prototype.constructor = Bullet;
