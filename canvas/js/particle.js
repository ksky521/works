Color = function (r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

Color.prototype = {
    setAlpha: function (a) {
        this.a = a;
    },
    copy: function () {
        return new Color(this.r, this.g, this.b);
    },
    toString: function () {
        return 'rgba(' + Math.floor(this.r * 255) + ',' + Math.floor(this.g * 255) + ',' + Math.floor(this.b * 255) + ',' + this.a.toFixed(2) + ')';
    },
    add: function (c) {
        return new Color(this.r + c.r, this.g + c.g, this.b + c.b);
    },
    multiply: function (s) {
        return new Color(this.r * s, this.g * s, this.b * s);
    },
    modulate: function (c) {
        return new Color(this.r * c.r, this.g * c.g, this.b * c.b);
    },
    saturate: function () {
        this.r = Math.min(this.r, 1);
        this.g = Math.min(this.g, 1);
        this.b = Math.min(this.b, 1);
    }
};

Color.black = new Color(0, 0, 0);
Color.white = new Color(1, 1, 1);
Color.red = new Color(1, 0, 0);
Color.green = new Color(0, 1, 0);
Color.blue = new Color(0, 0, 1);
Color.yellow = new Color(1, 1, 0);
Color.cyan = new Color(0, 1, 1);
Color.purple = new Color(1, 0, 1);


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var Particle = function (position, velocity, life, color, size) {
    this.position = position;//.copy().scale((Math.random() - .5), (Math.random() - .5));
    this.velocity = velocity;//copy().scale(Math.cos(270)*((Math.random() - .5)),Math.sin(270)*((Math.random() - .5)));
    this.acceleration = Vector2.zero;
    this.age = 0;
    this.life = life + (Math.random() + .5);
    this.color = color;
    this.size = size;
}

var ParticleSystem = function (dt, ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.dt = dt;
    this.particles = [];
    this.gravity = new Vector2(0, 100);
}
ParticleSystem.prototype.emit = function (particle) {
    return this.particles.push(particle);
}
ParticleSystem.prototype.update = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    var particles = this.particles;
    // console.log(particles.length);
    for (var i = 0; i < particles.length;) {
        var p = particles[i];
        if (p.age >= p.life) {
            this.kill(i);
        } else {
            p.age += this.dt;
            p.acceleration = this.gravity;
            p.position = p.position.add(p.velocity.copy().scale(dt));

            p.velocity.add(p.acceleration.copy().scale(dt));
            // console.log(1 - p.age / p.life);
            // console.log(p.age);
            p.color.setAlpha(1 - p.age / p.life);
            // p.size *= 1.02;
            ctx.fillStyle = p.color.toString();
            ctx.beginPath();
            ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            i++;
        }

    }
}
ParticleSystem.prototype.kill = function (i) {
    if (this.particles.length > 1) {
        this.particles[i] = this.particles[this.particles.length - 1];
    }
    this.particles.pop();
}

var dt = 0.01;
var ps = new ParticleSystem(dt, ctx, 500, 500);

function sampleDirection() {
    var theta = Math.random() * 2 * Math.PI;
    return new Vector2(Math.cos(theta), Math.sin(theta));
}

function step() {
    var v = sampleDirection().scale(100);
    ps.emit(new Particle(new Vector2(250, 250), v, 1, Color.red, 5));
    ps.update();
}
start(step);

function start(func) {
    var count = 0;

    var loop = function () {
        func();
        count++;
        // if (count < 4) {
        requestAnimationFrame(loop);
        // }
    }
    loop();
}
