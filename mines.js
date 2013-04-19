/*
var CLEAR = 0;
var BOMB = 0x1;
var FLAG = 0x10;
var makeBoard = function(width, height, mines) {
	if (mines >= width * height) {
		mines = width * height - 1;
	}
	var board = new Array(width*height);
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			board[y*height+x] = CLEAR;
		}
	}
	var minesPlaced = 0;
	while (minesPlaced < mines) {
		var location = Math.random() * width * height;
		console.log(location);
		if (board[location] == CLEAR) {
			board[location] = BOMB;
			minesPlaced++;
		}
	}
	return board;
};

var drawBoard = function(ctx, board, width) {
	var x = 0;
	var y = 0;
	var cellWidth = 20;
	var cellHeight = 20;
	for (var i = 0; i < board.length; board++) {
		var cell = board[i];
		console.log(cell);
		if (cell & FLAG) {
			ctx.fillStyle="#FF0000";
		}
		else if (cell & BOMB) {
			ctx.fillStyle="#00FF00";
		}
		else {
			ctx.fillStyle="#FFFFFF";
		}
		ctx.fillRect(x*cellWidth, y*cellHeight, cellWidth, cellHeight);
		x++;
		if (x > width) {
			x = 0;
			y++;
		}
	}
};

var load = function() {
	board = makeBoard(10,10,10);
	var c=document.getElementById("minesweeper");
	var ctx=c.getContext("2d");
	drawBoard(ctx, board, 10);
};
*/
var loadIt = function() {
	console.log("load");
};
