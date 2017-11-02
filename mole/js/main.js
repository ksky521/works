<<<<<<< Updated upstream
(function(window, document, $) {
    window.random = function(min, max) {
        return (Math.random() * (max - min + 1) + min) | 0;
    };
    var $canvas, $timer = document.getElementById('J-timer'),
        $progress = document.getElementById('J-progress'),
        stage,
        lastWidth = 100,
        lastSecond = 30,
        width = 300,
        height = 300,
        duration = 30e3;
    var holes = [
        [49, 49],
        [148, 49],
        [247, 49],
        [49, 148],
        [148, 148],
        [247, 148],
        [49, 247],
        [148, 247],
        [247, 247]
    ];
    var CAKES = {
        'zaoni': {
            enter: {
                fps: 100,
                times: 1,
                data: [
                    [0, 0, 82, 83, 8, 8],
                    [0, 0, 82, 83, 26, 26],
                    [0, 0, 82, 83, 68, 68],
                    [0, 0, 82, 83, 86, 86],
                    [0, 0, 82, 83, 100, 100],
                    [0, 0, 82, 83, 76, 77]
                ]
            },
            normal: {
                fps: 4,
                times: 2,
                data: [
                    [0, 0, 82, 83, 76, 77],
                    [0, 87, 82, 83, 76, 77]
                ]
            },
            outer: {
                fps: 50,
                times: 1,
                data: [
                    [0, 0, 82, 83, 68, 68],
                    [0, 0, 82, 83, 38, 38],
                    [0, 0, 82, 83, 8, 8]
                ]
            }
        },
        'wuren': {
            enter: {
                fps: 100,
                times: 1,
                data: [
                    [341, 86, 83, 83, 8, 8],
                    [341, 86, 83, 83, 26, 26],
                    [341, 86, 83, 83, 68, 68],
                    [341, 86, 83, 83, 86, 86],
                    [341, 86, 83, 83, 100, 100],
                    [341, 86, 83, 83, 76, 77]
                ]
            },
            normal: {
                fps: 4,
                times: 3,
                data: [
                    [341, 86, 83, 83, 76, 77],
                    [341, 86, 83, 83, 76, 77]
                ]
            },
            outer: {
                fps: 50,
                times: 1,
                data: [
                    [341, 86, 83, 83, 68, 68],
                    [341, 86, 83, 83, 38, 38],
                    [341, 86, 83, 83, 8, 8]
                ]
            },
            touch: {
                fps: 40,
                times: 3,
                data: [
                    [341, 0, 83, 83, 68, 68]
                ]
            }
        },
        'shuiguo': {
            enter: {
                fps: 100,
                times: 1,
                data: [
                    [84, 0, 82, 83, 8, 8],
                    [84, 0, 82, 83, 26, 26],
                    [84, 0, 82, 83, 52, 52],
                    [84, 0, 82, 83, 86, 86],
                    [84, 0, 82, 83, 100, 100],
                    [84, 0, 82, 83, 76, 77]
                ]
            },
            normal: {
                fps: 4,
                times: 2,
                data: [
                    [84, 0, 82, 83, 76, 77],
                    [84, 87, 82, 83, 76, 77]
                ]
            },
            outer: {
                fps: 50,
                times: 1,
                data: [
                    [84, 0, 82, 83, 68, 68],
                    [84, 0, 82, 83, 38, 38],
                    [84, 0, 82, 83, 8, 8]
                ]
            }
        },
        'lianrong': {
            enter: {
                fps: 100,
                times: 1,
                data: [
                    [169, 0, 83, 83, 8, 8],
                    [169, 0, 83, 83, 26, 26],
                    [169, 0, 83, 83, 52, 52],
                    [169, 0, 83, 83, 86, 86],
                    [169, 0, 83, 83, 100, 100],
                    [169, 0, 83, 83, 76, 77]
                ]
            },
            normal: {
                fps: 4,
                times: 2,
                data: [
                    [169, 0, 83, 83, 76, 77],
                    [169, 87, 83, 83, 76, 77]
                ]
            },
            outer: {
                fps: 50,
                times: 1,
                data: [
                    [169, 0, 83, 83, 68, 68],
                    [169, 0, 83, 83, 38, 38],
                    [169, 0, 83, 83, 8, 8]
                ]
            }
        },
        'lvdou': {
            enter: {
                fps: 100,
                times: 1,
                data: [
                    [255, 0, 83, 83, 8, 8],
                    [255, 0, 83, 83, 26, 26],
                    [255, 0, 83, 83, 52, 52],
                    [255, 0, 83, 83, 68, 68],
                    [255, 0, 83, 83, 86, 86],
                    [255, 0, 83, 83, 100, 100],
                    [255, 0, 83, 83, 76, 77]
                ]
            },
            normal: {
                fps: 4,
                times: 2,
                data: [
                    [255, 0, 83, 83, 76, 77],
                    [255, 87, 83, 83, 76, 77]
                ]
            },
            outer: {
                fps: 50,
                times: 1,
                data: [
                    [255, 0, 83, 83, 68, 68],
                    [255, 0, 83, 83, 38, 38],
                    [255, 0, 83, 83, 8, 8]
                ]
            }
        }
    };

    var sourceLen = 2;
    var img = new Image();
    img.src = './img/sprite.png';
    img.onload = init;
    var sound;
    var clickAudio, gameOverAudio;
    if (Box.os.name === 'ios' && ('Audio' in window)) {
        sourceLen++;

        try {
            //三秒加载不完声音，就超时
            var timer = setTimeout(function() {
                sound = null;
                init();
            }, 3000);
            clickAudio = new Audio();
            // gameOverAudio = new Audio();
            // gameOverAudio.src = './game-over.mp3';
            // gameOverAudio.autobuffer = true;
            // gameOverAudio.load();
            // gameOverAudio.muted = true;

            clickAudio.src = './click.mp3';
            clickAudio.autobuffer = true;
            clickAudio.load();
            clickAudio.muted = true;
            clickAudio.addEventListener('canplay', function() {
                clearTimeout(timer);
                if (clickAudio) {
                    init();
                }
            });
            clickAudio.addEventListener('error', function() {
                clearTimeout(timer);
                clickAudio = null;
                init();
            });
            clickAudio.addEventListener('abort', function() {
                clearTimeout(timer);
                clickAudio = null;
                init();
            });

            // gameOverAudio.addEventListener('error', function() {
            //     gameOverAudio = null;
            // });
            // gameOverAudio.addEventListener('abort', function() {
            //     gameOverAudio = null;
            // });
        } catch (e) {
            // gameOverAudio = null;
            clickAudio = null;
            console.log(e);
        }

    }


    function init() {
        sourceLen--;
        if (sourceLen !== 0) {
            return;
        }
        $canvas = document.getElementById('c');
        $canvas.width = width;
        $canvas.height = height;
        stage = new Stage('c', width, height);
        stage.on('update', clock).on('touchstart', function() {
            if (clickAudio) {
                clickAudio.muted = false;
                clickAudio.play();
            }
        }).on('stop', function(msg) {
            if (msg === 'fail') {
                // if (gameOverAudio) {
                //     gameOverAudio.muted = false;
                //     gameOverAudio.play();
                // }
                $('#J-fail').show();
                setTimeout(function() {
                    show(msg);
                    $('#J-fail').hide();
                }, 640);
            } else {
                showLoading();
                setTimeout(function() {
                    show();
                }, 1000);
            }
        });
        // start();
        Box.share({
            title: '分享',
            content: '分享',
            id: 'J-share'
        });

        $('.J-start').click(function() {
            closeLayer();
            $(window).scrollTop(130);
            setTimeout(function() {
                start();
            }, 300);
        });
        $('#J-start').removeAttr('disabled').html('开始游戏');
        $('.J-close').click(function() {
            closeLayer();
        });
        $('#J-address').click(function() {
            location.href = 'success';
        });
    }

    function show(msg) {
        $('.J-num').html(stage.score);
        $('.J-gameOver').hide();
        if (msg === 'fail') {
            $('#J-over').show();
        } else {
            $('#J-success').show();
        }
        $('#J-result').show();
        $('#J-mask').show();
    }

    function showLoading() {
        $('#J-mask').show();
        $('#J-loading').show();
    }

    function start() {
        if (stage.sprites) {
            stage.sprites.forEach(function(s) {
                if (s.destroy) {
                    s.destroy();
                }
            });
        }
        stage.reset();
        var cakeNames = ['lvdou', 'wuren', 'shuiguo', 'lianrong', 'zaoni'];
        var hs = holes.slice(0);
        //1、打乱洞的顺序

        //对象池
        var pool = new Pool(function() {
            var t = random(0, hs.length - 1);
            t = hs.splice(t, 1)[0];
            var cake = new Cake(t[0], t[1], 'wuren', CAKES, cakeNames);
            return cake;
        }, {
            min: 1,
            max: 1
        });
        for (var i = 0, len = cakeNames.length; i < len; i++) {
            var t = hs[random(0, hs.length - 1)];
            var cake = new Cake(t[0], t[1], cakeNames[i], CAKES, cakeNames);
            pool.addFree(cake);
        }
        //2、生成timeline
        //3、timeline添加月饼
        var interval = 360;
        for (var i = 0; i < duration; i += interval) {
            var tl = {
                startTime: i,
                //动画持续时间
                endTime: (i + 800),
                beforeStart: function(o) {
                    var cc = pool.getRandomOne();
                    var t = random(0, hs.length - 1);
                    t = hs.splice(t, 1)[0];
                    var g = 1; //加速度
                    if (o.startTime > 10e3) {
                        g = 1.2;
                    } else if (o.startTime > 20e3) {
                        g = 1.3;
                    }
                    cc.reset(t[0], t[1], g);
                    stage.addSprite(cc)
                    o.c = cc;
                    o.t = t;
                },
                afterEnd: function(o) {
                    var cc = o.c;
                    stage.removeSprite(cc);
                    hs.push(o.t);
                    pool.freeOne(cc);
                }
            };
            if (i > 10e3) {
                interval = 300;
            }
            if (i > 20e3) {
                interval = 270;
            }
            // console.log(tl);
            stage.timeline(tl);
        }
        stage.play();
        update();
    }

    function replay() {
        lastWidth = 100;
        lastSecond = 30;
    }
    //更新进度条和时间轴
    function clock() {
        var w = Math.ceil((1 - (stage.duration / duration)) * 100);
        var s = Math.ceil((duration - stage.duration) / 1000);
        if (lastWidth !== w && w >= 0) {
            lastWidth = w;
            $progress.style.width = w + '%';
        }
        if (lastSecond !== s && s >= 0) {
            lastSecond = s;
            $timer.innerHTML = s;
        }
    }
    //update
    function update() {
        if (stage.duration > duration) {
            stage.stop();
            return;
        }
        requestAnimationFrame(update);
        stage.update();
=======
(function(window, document) {
    var $canvas;

    function $(id) {
        return document.getElementById(id);
    }

    function init() {
        $canvas = $('c');
        $canvas.width = 320;
        $canvas.height = 400;
        var stage = new Stage('c', $canvas.width, $canvas.height);

>>>>>>> Stashed changes
    }

    window.onload = init;

    function closeLayer() {
        $('.J-mydia').hide();
        $('#J-mask').hide();
        $('#J-loading').hide();
    }


}(window, document, Zepto));
