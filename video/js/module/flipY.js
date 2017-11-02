/*
 *
 * */
;
(function(Ps) {

	window[Ps].module("flipY", function(P) {

		var M = {
			process: function(imgData) {
				var data = imgData.data;
				var w = imgData.width;
				var h = imgData.height;

				var w4 = w * 4;
				var dataCopy = new Uint8Array;
				for (var i = 0, len = data.length; i < len; i++) {
					dataCopy[i] = data[i];
				}
				for (var i = 0; i <= w; i++) {
					for (var j = 0; j <= h; j++) {
						var offset = j * w4 + i * 4;
						var offset2 = j * w4 + (w - i) * 4;
						data[offset2] = dataCopy[offset];
						data[offset2 + 1] = dataCopy[offset + 1];
						data[offset2 + 2] = dataCopy[offset + 2];
						data[offset2 + 3] = dataCopy[offset + 3];
					}
				}
				return imgData;
			}
		};

		return M;

	});

})("psLib");