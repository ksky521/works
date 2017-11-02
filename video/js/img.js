(function(window, document, undefined) {

	var Theo = function() {};

	Theo.prototype = {
		constructor: Theo,
		process: function(canvas, fn, args) {
			var ctx = this.getCanvasContext(canvas);
			args = [ctx].concat(args);
			return fn.apply(window, args);
		},
		clone: function(ctx, width, height) {
			var imgData = ctx.getImageData(0, 0, width, height);
			return this.toCanvas(imgData);
		},
		toCanvas: function(o) {
			var canvas;
			if (typeof o == 'object') {
				if (typeof o.tagName === 'string') {
					if (o.tagName.toLowerCase() === 'canvas' || o.tagName.toLowerCase() === 'img') {
						canvas = document.createElement('canvas');
						canvas.width = o.width;
						canvas.height = o.height;
						canvas.getContext('2d').drawImage(o, 0, 0);
					}
				} else if ((window.ImageData && o instanceof window.ImageData) || (typeof o.width === 'number' && typeof o.height === 'number' && typeof o.data === 'object')) {
					canvas = document.createElement('canvas');
					canvas.width = o.width;
					canvas.height = o.height;
					canvas.getContext('2d').putImageData(o, 0, 0);
				}
			}
			return canvas;
		},
		toImageData: function(o) {
			var canvas = this.toCanvas(o);
			var ctx = canvas.getContext('2d');
			return ctx.getImageData(0, 0, canvas.width, canvas.height);
		},
		getCanvasContext: function(o) {
			if (o.getContext) {
				return o.getContext('2d');
			} else {
				return o;
			}
		},
		toImage: function(o) {
			var canvas = this.toCanvas(o);
			var image = new Image();
			image.width = canvas.width;
			image.height = canvas.height;
			image.src = canvas.toDataURL();
			return image;
		}
	}
	window.Theo = Theo;
}(window, document));