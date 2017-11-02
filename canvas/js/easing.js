var Easing = {
    get: function(a, b, c, e, d, f, g) {
        return b + Easing[a](Math.min(e, d), d, f, g) * (c - b)
    },
    getRound: function(a, b, c, e, d, f, g) {
        return Math.round(Easing.get(a, b, c, e, d, f, g))
    },
    easeInQuad: function(a, b) {
        return (a /= b) * a
    },
    easeOutQuad: function(a, b) {
        return -(a /= b) * (a - 2)
    },
    easeInOutQuad: function(a, b) {
        return (a /= b / 2) < 1 ? 0.5 * a * a : -0.5 * (--a * (a - 2) - 1)
    },
    easeInCubic: function(a, b) {
        return (a /= b) * a * a
    },
    easeOutCubic: function(a, b) {
        return (a = a / b - 1) * a * a + 1
    },
    easeInOutCubic: function(a, b) {
        return (a /= b / 2) < 1 ? 0.5 * a * a * a : 0.5 * ((a -= 2) * a * a + 2)
    },
    easeInQuart: function(a,
    b) {
        return (a /= b) * a * a * a
    },
    easeOutQuart: function(a, b) {
        return -((a = a / b - 1) * a * a * a - 1)
    },
    easeInOutQuart: function(a, b) {
        return (a /= b / 2) < 1 ? 0.5 * a * a * a * a : -0.5 * ((a -= 2) * a * a * a - 2)
    },
    easeInQuint: function(a, b) {
        return (a /= b) * a * a * a * a
    },
    easeOutQuint: function(a, b) {
        return (a = a / b - 1) * a * a * a * a + 1
    },
    easeInOutQuint: function(a, b) {
        return (a /= b / 2) < 1 ? 0.5 * a * a * a * a * a : 0.5 * ((a -= 2) * a * a * a * a + 2)
    },
    easeInSine: function(a, b) {
        return -Math.cos(a / b * (Math.PI / 2))
    },
    easeOutSine: function(a, b) {
        return Math.sin(a / b * (Math.PI / 2))
    },
    easeInOutSine: function(a, b) {
        return -0.5 * (Math.cos(Math.PI * a / b) - 1)
    },
    easeInExpo: function(a, b) {
        return a == 0 ? 1 : Math.pow(2, 10 * (a / b - 1))
    },
    easeOutExpo: function(a, b) {
        return a == b ? 1 : -Math.pow(2, - 10 * a / b) + 1
    },
    easeInOutExpo: function(a, b) {
        return a == 0 ? 0 : a == b ? 1 : (a /= b / 2) < 1 ? 0.5 * Math.pow(2, 10 * (a - 1)) : 0.5 * (-Math.pow(2, - 10 * --a) + 2)
    },
    easeInCirc: function(a, b) {
        return -(Math.sqrt(1 - (a /= b) * a) - 1)
    },
    easeOutCirc: function(a, b) {
        return Math.sqrt(1 - (a = a / b - 1) * a)
    },
    easeInOutCirc: function(a, b) {
        return (a /= b / 2) < 1 ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
    },
    easeInBack: function(a,
    b, c) {
        c == void 0 && (c = 1.70158);
        return (a /= b) * a * ((c + 1) * a - c)
    },
    easeOutBack: function(a, b, c) {
        c == void 0 && (c = 1.70158);
        return (a = a / b - 1) * a * ((c + 1) * a + c) + 1
    },
    easeInOutBack: function(a, b, c) {
        c == void 0 && (c = 1.70158);
        return (a /= b / 2) < 1 ? 0.5 * a * a * (((c *= 1.525) + 1) * a - c) : 0.5 * ((a -= 2) * a * (((c *= 1.525) + 1) * a + c) + 2)
    },
    easeInBounce: function(a, b) {
        return 1 - Easing.easeOutBounce(b - a, b)
    },
    easeOutBounce: function(a, b) {
        return (a /= b) < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375
    },
    easeInOutBounce: function(a, b) {
        return a < b / 2 ? Easing.easeInBounce(a * 2, b) * 0.5 : Easing.easeOutBounce(a * 2 - b, b) * 0.5 + 0.5
    }
};
