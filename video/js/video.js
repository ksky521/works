(function(window, document, undefined) {
	//把alloyPhoto方法拿过来

	function require(module, callback) {
		var script = document.createElement('script');
		var url = './js/module/' + module + '.js';
		script.onload = function() {
			script = null;
			(typeof callback === 'function') && callback();
		};
		script.src = url;
		document.body.appendChild(script);
	}

	var ps = {
		lib: {},
		module: function(name, factory) {
			this.lib[name] = factory(this);
		},
		act: function(imgData, method) {

			if (!imgData) {
				new Error('act 参数错误：第一个参数应该是imgData');
			}

			var moduleName = this.lib.config.getModuleName(method);
			var lib = this.lib[moduleName];
			// console.log(revise);
			return lib && lib.process && lib.process(imgData, [arg1 * revise, arg2 * revise, arg3 * revise]);
		}
	};
	window.psLib = ps;
	require('config');
	// require('easy');
	require('dorsyMath');

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var width = 400,
		height = 300;
	var video = document.getElementById('webcam');
	var select = document.getElementById('effect');
	(function() {
		var i = 0,
			lastTime = 0,
			vendors = ['webkit', 'moz', 'ms', 'o'],
			len = vendors.length;

		while (i < len && !window.requestAnimationFrame) {
			window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
			i++;
		}
		i = 0;
		while (i < len && !navigator.getUserMedia) {
			navigator.getUserMedia = navigator[vendors[i] + 'GetUserMedia'];
			i++;
		}
		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = function(callback, element) {
				var currTime = +new Date(),
					timeToCall = Math.max(0, 1000 / 60 - currTime + lastTime),
					id = setTimeout(function() {
						callback(currTime + timeToCall);
					}, timeToCall);

				lastTime = currTime + timeToCall;
				return id;
			};
		}
	}());
	try {
		navigator.getUserMedia({
			video: true,
			audio: false
		}, startVideo, function() {
			alert('出现问题，或者不支持getUserMedia');
		});
	} catch (e) {
		try {
			navigator.getUserMedia('video', startVideo, function() {
				alert('出现问题，或者不支持getUserMedia');
			});
		} catch (e) {}
	}

	function startVideo(stream) {
		var domURL = window.URL || window.webkitURL;
		video.src = domURL ? domURL.createObjectURL(stream) : stream;
	}

	var effect = select.value;
	var revise = document.querySelector('option[selected]').dataset.revise;
	select.addEventListener('change', function() {
		effect = this.value;
		revise = revises[effect];
	}, false);
	var $arg1 = document.getElementById('arg1');
	var $arg2 = document.getElementById('arg2');
	var $arg3 = document.getElementById('arg3');
	var arg1 = $arg1.value;
	var arg2 = $arg2.value;
	var arg3 = $arg3.value;
	var $opts = document.querySelectorAll('option');
	$opts = [].slice.call($opts);
	var revises = {};
	var tempNode;

	while (tempNode = $opts.shift()) {
		revises[tempNode.value] = tempNode.dataset.revise
	}
	// console.log(revises);
	$arg1.addEventListener('change', function() {
		arg1 = this.value;
	});
	$arg2.addEventListener('change', function() {
		arg2 = this.value;
	});
	$arg3.addEventListener('change', function() {
		arg3 = this.value;
	});

	function copyVideo() {
		requestAnimationFrame(copyVideo);
		context.clearRect(0, 0, width, height);
		context.drawImage(video, 0, 0, width, height);
		var imgData = context.getImageData(0, 0, width, height);

		actModule(effect, imgData)
		// imgData = ps.act(imgData,'添加杂色');

	}

	function actModule(name, imgData) {
		var moduleName = ps.lib.config.getModuleName(name);
		var act = ps.lib[moduleName];
		if (act && act.process) {
			temp();
		} else {
			require(moduleName, temp);
		}

		function temp() {
			context.clearRect(0, 0, width, height);
			imgData = ps.act(imgData, name);
			context.putImageData(imgData, 0, 0);
		}
	}
	window.copyVideo = copyVideo;



	//motion capture
	var motionCapture;
	(function() {
		var lastImg;

		function motion(context, width, height) {
			var current = context.getImageData(0, 0, width, height);

			if (lastImg) {
				var imgData = context.createImageData(0,0,width,height);
				var backData = imgData.data;
				var curData = current.data;
				var lastData = lastImg.Data;

				

			} else {
				var imgData = lastImg = current;

			}
			return imgData;
		}

	}());

}(window, document));