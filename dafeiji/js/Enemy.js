function Enemy(opt) {
    this.stageWidth = opt.stageWidth;
    this.stageHeight = opt.stageHeight;
    this.speedX = 0;
    this.speedY = 3;
    this.hits = 1;
    this.x = opt.x || 100;
    this.y = opt.y || 300;
    this.width = 34;
    this.height = 24;
}

Enemy.prototype = new Sprite({
    name: 'Enemy',
    frames: {
        fly: {
            fps: 1,
            times: 0,
            data: [
                [82, 657, 34, 24]
            ]
        },
        fire: {
            fps: 8,
            times: 1,
            data: [
                [48, 658, 34, 24],
                [420, 730, 34, 28],
                [472, 719, 38, 34]
            ]
        }
    }
});

Enemy.prototype.constructor = Enemy;