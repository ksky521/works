/**
 * 降噪
 * @param  {[type]} imgData [description]
 * @return {[type]}         [description]
 */
function removeNoise(imgData) {
	var w = imgData.width;
	var h = imgData.height;
	var data = imgData.data;
	var w4 = w * 4;
	var y = h;
	do {
		var offsetY = (y - 1) * w4;

		var nextY = (y == h) ? y - 1 : y;
		var prevY = (y == 1) ? 0 : y - 2;

		var offsetYPrev = prevY * w * 4;
		var offsetYNext = nextY * w * 4;

		var x = w;
		do {
			var offset = offsetY + (x * 4 - 4);

			var offsetPrev = offsetYPrev + ((x == 1) ? 0 : x - 2) * 4;
			var offsetNext = offsetYNext + ((x == w) ? x - 1 : x) * 4;

			var minR, maxR, minG, maxG, minB, maxB;

			minR = maxR = data[offsetPrev];
			var r1 = data[offset - 4],
				r2 = data[offset + 4],
				r3 = data[offsetNext];
			if (r1 < minR) minR = r1;
			if (r2 < minR) minR = r2;
			if (r3 < minR) minR = r3;
			if (r1 > maxR) maxR = r1;
			if (r2 > maxR) maxR = r2;
			if (r3 > maxR) maxR = r3;

			minG = maxG = data[offsetPrev + 1];
			var g1 = data[offset - 3],
				g2 = data[offset + 5],
				g3 = data[offsetNext + 1];
			if (g1 < minG) minG = g1;
			if (g2 < minG) minG = g2;
			if (g3 < minG) minG = g3;
			if (g1 > maxG) maxG = g1;
			if (g2 > maxG) maxG = g2;
			if (g3 > maxG) maxG = g3;

			minB = maxB = data[offsetPrev + 2];
			var b1 = data[offset - 2],
				b2 = data[offset + 6],
				b3 = data[offsetNext + 2];
			if (b1 < minB) minB = b1;
			if (b2 < minB) minB = b2;
			if (b3 < minB) minB = b3;
			if (b1 > maxB) maxB = b1;
			if (b2 > maxB) maxB = b2;
			if (b3 > maxB) maxB = b3;

			if (data[offset] > maxR) {
				data[offset] = maxR;
			} else if (data[offset] < minR) {
				data[offset] = minR;
			}
			if (data[offset + 1] > maxG) {
				data[offset + 1] = maxG;
			} else if (data[offset + 1] < minG) {
				data[offset + 1] = minG;
			}
			if (data[offset + 2] > maxB) {
				data[offset + 2] = maxB;
			} else if (data[offset + 2] < minB) {
				data[offset + 2] = minB;
			}

		} while (--x);
	} while (--y);
	return imgData;
}
/**
 * 沿y轴翻转
 * @param  {[type]} imgData [description]
 * @return {[type]}         [description]
 */
function flipY(imgData) {
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
/**
 * 沿x轴翻转
 * @param  {[type]} imgData [description]
 * @return {[type]}         [description]
 */
function flipX(imgData) {
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
			var offset2 = (h - j) * w4 + i * 4;
			data[offset2] = dataCopy[offset];
			data[offset2 + 1] = dataCopy[offset + 1];
			data[offset2 + 2] = dataCopy[offset + 2];
			data[offset2 + 3] = dataCopy[offset + 3];
		}
	}

	return imgData;
}
/**
 * 检测边缘
 * @param  {[type]} imgData [description]
 * @param  {[type]} mono    [description]
 * @param  {[type]} invert  [description]
 * @return {[type]}         [description]
 */
function edge(imgData, mono, invert) {
	mono = mono || false;
	invert = invert || false;
	var c = -1 / 8;
	
	var data = imgData.data;
	var dataCopy = new Uint8Array;
	for (var i = 0, len = data.length; i < len; i++) {
		dataCopy[i] = data[i];
	}
	var weight = 1 / c;

	var w = imgData.width;
	var h = imgData.height;

	var w4 = w * 4;
	var y = h;
	do {
		var offsetY = (y - 1) * w4;

		var nextY = (y == h) ? y - 1 : y;
		var prevY = (y == 1) ? 0 : y - 2;

		var offsetYPrev = prevY * w * 4;
		var offsetYNext = nextY * w * 4;

		var x = w;
		do {
			var offset = offsetY + (x * 4 - 4);

			var offsetPrev = offsetYPrev + ((x == 1) ? 0 : x - 2) * 4;
			var offsetNext = offsetYNext + ((x == w) ? x - 1 : x) * 4;

			var r = ((dataCopy[offsetPrev - 4] + dataCopy[offsetPrev] + dataCopy[offsetPrev + 4] + dataCopy[offset - 4] + dataCopy[offset + 4] + dataCopy[offsetNext - 4] + dataCopy[offsetNext] + dataCopy[offsetNext + 4]) * c + dataCopy[offset]) * weight;

			var g = ((dataCopy[offsetPrev - 3] + dataCopy[offsetPrev + 1] + dataCopy[offsetPrev + 5] + dataCopy[offset - 3] + dataCopy[offset + 5] + dataCopy[offsetNext - 3] + dataCopy[offsetNext + 1] + dataCopy[offsetNext + 5]) * c + dataCopy[offset + 1]) * weight;

			var b = ((dataCopy[offsetPrev - 2] + dataCopy[offsetPrev + 2] + dataCopy[offsetPrev + 6] + dataCopy[offset - 2] + dataCopy[offset + 6] + dataCopy[offsetNext - 2] + dataCopy[offsetNext + 2] + dataCopy[offsetNext + 6]) * c + dataCopy[offset + 2]) * weight;

			if (mono) {
				var brightness = (r * 0.3 + g * 0.59 + b * 0.11) || 0;
				if (invert) brightness = 255 - brightness;
				if (brightness < 0) brightness = 0;
				if (brightness > 255) brightness = 255;
				r = g = b = brightness;
			} else {
				if (invert) {
					r = 255 - r;
					g = 255 - g;
					b = 255 - b;
				}
				if (r < 0) r = 0;
				if (g < 0) g = 0;
				if (b < 0) b = 0;
				if (r > 255) r = 255;
				if (g > 255) g = 255;
				if (b > 255) b = 255;
			}

			data[offset] = r;
			data[offset + 1] = g;
			data[offset + 2] = b;

		} while (--x);
	} while (--y);
	return imgData;
}

function noise(imgData, arg) {
	var R = arg || 100;
	var data = imgData.data;
	var width = imgData.width;
	var height = imgData.height;
	var xLength = R * 2 + 1;

	//区块
	for (var x = 0; x < width; x++) {

		for (var y = 0; y < height; y++) {

			var realI = y * width + x;
			for (var j = 0; j < 3; j++) {
				var rand = parseInt(Math.random() * R * 2) - R;
				data[realI * 4 + j] += rand;
			}

		}

	}

	return imgData;

}