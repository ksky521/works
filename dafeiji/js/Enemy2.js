function Enemy2(opt) {
    this.stageWidth = opt.stageWidth;
    this.stageHeight = opt.stageHeight;
    this.speedX = 0;
    this.speedY = 2.8;
    this.hits = 2;
    this.x = opt.x || 100;
    this.y = opt.y || 300;
    this.width = 46;
    this.height = 60;
}

Enemy2.prototype = new Sprite({
    name: 'Enemy',
    frames: {
        fly: {
            fps: 1,
            times: 0,
            data: [
                [0, 569, 46, 60]
            ]
        },
        
        fire: {
            fps: 10,
            times: 1,
            data: [
                [432, 413, 46, 63],
                [432, 538, 46, 61],
                [432, 599, 46, 58],
                [432, 479, 46, 59]
            ]
        }
    }
});

Enemy2.prototype.constructor = Enemy2;