function Game(id, width, height) {
	var canvas = this.canvas = document.getElementById(id);
	canvas.width = width || 600;
	canvas.height = height || 400;
	this.ctxt = this.canvas.getContext('2d');
}

Game.prototype = {
	constructor: Game,
	_map: [],
	setMap: function(map){
		this._map = map;
	},
	setXY: function(x, y) {

	},
	start: function(){},
	pause: function(){},
	stop: function(){},
	update: function() {},
	draw: function() {

	},
	bindEvent: function() {
		//this.canvas.addEventLisenter()
	},
	handleEvent: function(e) {
		//e.preventDefault();
	}
}