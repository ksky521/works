window.addEventListener('load', function() {
    var width = 320,
        height = 568;
    var stage = new Stage('game', {
        width: width,
        height: height
    });
    var lastEnemyTime = 0;
    var lastEnemyTime2 = 0;
    stage.on('update', function(ctx, stage) {
        var durtion = stage.durtion;
        var a = durtion - lastEnemyTime;
        if (a > 800) {
            lastEnemyTime = durtion;
            var w = random(0, 8) * 34 + random(0, 10);

            var enemy = new Enemy({
                stageHeight: height,
                stageWidth: width,
                x: w,
                y: -24
            });
            stage.addSprite(enemy);
        }

    }).on('update', function(ctx, stage) {
        var durtion = stage.durtion;
        var a = durtion - lastEnemyTime2;
        if (a > 3000) {
            lastEnemyTime2 = durtion;
            var w = random(0, 5) * 56 + random(0, 10);

            var enemy = new Enemy2({
                stageHeight: height,
                stageWidth: width,
                x: w,
                y: -60
            });
            stage.addSprite(enemy);
        }

    });

    var plane = new Plane({
        stageHeight: height,
        stageWidth: width
    });

    stage.addSprite(plane);

    function update() {
        requestAnimationFrame(update);
        stage.update();
    }
    update();



    var playControl = {
        left: function() {
            plane.x -= 6;
            if (plane.x < 0) {
                plane.x = 0;
            }
        },
        right: function() {
            plane.x += 6;
            if (plane.x + plane.width > width) {
                plane.x = width - plane.width;
            }
        },
        up: function() {
            plane.y -= 6;
            if (plane.y < 0) {
                plane.y = 0;
            }
        },
        down: function() {
            plane.y += 6;
            if (plane.y + plane.height > height) {
                plane.y = height - plane.height;
            }
        }
    };
    var keyMap = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    document.addEventListener('keydown', function(e) {
        var key = keyMap[e.keyCode];
        if (key && typeof playControl[key] === 'function') {
            playControl[key]();
        }
    }, true);

    // stage.canvas.addEventListener('mousedown', down, false);
    // var pLeft = 0,
    //     pTop = 0;
    // var canvasXY = getOffset(stage.canvas);
    // var canvasX = canvasXY.left;
    // var canvasY = canvasXY.top;

    // var dx = 0,
    //     dy = 0;

    // function down(e) {
    //     var x = e.pageX;
    //     var y = e.pageY;

    //     dx = x - canvasX;
    //     dy = y - canvasY;

    //     var planeTop = plane.y,
    //         planeRight = plane.x + plane.width,
    //         planeBottom = plane.y + plane.height,
    //         planeLeft = plane.x;

    //     if (dx > planeLeft && dx < planeRight && dy > planeTop && dy < planeBottom) {
    //         dx = x;
    //         dy = y;
    //         this.addEventListener('mousemove', move, false);
    //         this.addEventListener('mouseup', end, false);
    //         this.addEventListener('mouseout', end, false);
    //     }
    // }

    // function move(e) {
    //     var x = e.pageX;
    //     var y = e.pageY;

    //     pLeft = x - dx;
    //     pTop = y - dy;
    //     plane.setSpeedX = pLeft;
    //     // plane.x += pLeft;
    //     // plane.y += pTop;

    // }

    // function end(e) {
    //     this.removeEventListener('mousemove', move, false);
    //     this.removeEventListener('mouseup', end, false);
    //     this.removeEventListener('mouseout', end, false);
    // }

    window.stage = stage;
}, false);