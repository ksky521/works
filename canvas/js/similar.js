function getHistogram(imageData) {
	var arr = [];
	for (var i = 0; i < 64; i++) {
		arr[i] = 0;
	}
	var data = imageData.data;
	var pow4 = Math.pow(4, 2);
	for (var i = 0, len = data.length; i < len; i += 4) {
		var red = (data[i] / 64) | 0;
		var green = (data[i + 1] / 64) | 0;
		var blue = (data[i + 2] / 64) | 0;

		var index = red * pow4 + green * 4 + blue;

		arr[index]++;
	}

	return arr;
}

function cosine(arr1, arr2) {
	var axb = 0,
		a = 0,
		b = 0;
	for (var i = 0, len = arr1.length; i < len; i++) {
		axb += arr1[i] * arr2[i];
		a += arr1[i] * arr1[i];
		b += arr2[i] * arr2[i];
	}
	return axb / (Math.sqrt(a) * Math.sqrt(b));
}

function $(id) {
	return document.getElementById(id);
}

function gray(imgData) {
	var data = imgData.data;
	for (var i = 0, len = data.length; i < len; i += 4) {
		var gray = parseInt((data[i] + data[i + 1] + data[i + 2]) / 3);
		data[i + 2] = data[i + 1] = data[i] = gray;
	}
	return imgData;
}
var canvas1 = $('canvas1');
var canvas2 = $('canvas2');

var img1 = new Image;
var img2 = new Image;
var ctx1, ctx2;
var width1, height1, width2, height2;
img1.onload = function() {
	width1 = canvas1.width = this.width;
	height1 = canvas1.height = this.height;
	ctx1 = canvas1.getContext('2d');
	ctx1.drawImage(this, 0, 0);
}
img2.onload = function() {
	width2 = canvas2.width = this.width;
	height2 = canvas2.height = this.height;
	ctx2 = canvas2.getContext('2d');
	ctx2.drawImage(this, 0, 0);
}
img1.src = 'http://127.0.0.1/a.jpg';
img2.src = 'http://127.0.0.1/b.jpg';

function jisuan() {
	var imgData1 = ctx1.getImageData(0, 0, width1, height1);
	var imgData2 = ctx2.getImageData(0, 0, width2, height2);
	var arr1 = getHistogram(imgData1);
	var arr2 = getHistogram(imgData2);
	alert(cosine(arr1, arr2));
}