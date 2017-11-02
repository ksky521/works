var Background = function(canvas, obj) {

    var self = this;
    self.width = obj.width;
    self.height = obj.height;
    self.speed = obj.speed;

    self.imgURL = obj.imgURL;


    self.canvas = typeof canvas === 'object' ? canvas : $$(canvas);
    self.ctx = this.canvas.getContext('2d');

    var img = new Image();


    img.onload = function() {
        self.imgLoad();
    };
    img.onerror = function() {
        self.imgError();
    }
    img.src = self.imgURL;
    self.img = img;
    this.init();
};

Background.prototype = {
    constructor: Background,
    init: function() {
        this.curY = 0;
    },
    imgLoad: function() {},
    imgError: function() {},
    changeSpeed: function(speed) {
        this.speed = speed;
        return this;
    },
    update: function() {
        // console.log(1);
        this.clearRect();
        var self = this;
        var width = this.width,
            height = this.height,
            img = this.img;
        var ctx = self.ctx;
        var curY = self.curY;

        curY += self.speed;

        if (curY > height) {
            curY = height - curY;
        }
        var y1 = height - curY;
        var y2 = curY;

        var arr1 = [img, 0, 0, width, y1, 0, curY, width, y1];
        var arr2 = [img, 0, y1, width, curY, 0, 0, width, curY];
        // console.log(arr1, arr2);
        ctx.drawImage.apply(ctx, arr1);
        ctx.drawImage.apply(ctx, arr2);
        self.curY = curY;
    },
    clearRect: function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // this.ctx.save();
        return this;
    }
};


var bg = new Background('bg', {
    width: 320,
    height: 568,
    speed: 2,
    imgURL: './img/gameArts.png'
});
function bgupdate(){
    requestAnimationFrame(bgupdate);
    // console.log(222);
    bg.update();
}
bgupdate();