var CLEAR = 0;
var MINE = 0x1;
var FLAG = 0x10;
var makeBoard = function(width, height, mines) {
	if (mines >= width * height) {
		mines = width * height - 1;
	}
	var board = new Array(height);
	for (var y = 0; y < height; y++) {
		var row = new Array(width);
		for (var x = 0; x < width; x++) {
			row[x] = CLEAR;
		}
		board[y] = row;
	}
	var minesPlaced = 0;
	while (minesPlaced < mines) {
		var y = Math.floor(Math.random() * height);
		var x = Math.floor(Math.random() * width);
		if (board[y][x] == CLEAR) {
			board[y][x] = MINE;
			minesPlaced++;
		}
	}
	return board;
};

var adjacentMines = function(board, row, col) {
	mineCount = 0;
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			if (i != 0 || j != 0) {
				if (row + i >= 0 && row + i < board.length) {
					if (col + j >= 0 && col + j < board[row+i].length) {
						if (board[row+i][col+j] & MINE) {
							mineCount++;
						}
					}
				}
			}
		}
	}
	return mineCount;
}

var drawBoard = function(ctx, board) {
	var cellWidth = 20;
	var cellHeight = 20;
	console.log(board.length);
	for (var row = 0; row < board.length; row++) {
		for (var col = 0; col < board[row].length; col++) {
			var cell = board[row][col];
			console.log(cell);
			if (cell & FLAG) {
				ctx.fillStyle="#FF0000";
			}
			else if (cell & MINE) {
				ctx.fillStyle="#00FF00";
			}
			else {
				var text = adjacentMines(board, row, col).toString();
				ctx.strokeText(text, col*cellWidth, row*cellHeight);
				ctx.fillStyle="#ffffff";
			}
			ctx.fillRect(col*cellWidth, row*cellHeight, cellWidth, cellHeight);
		}
	}
};

var onLoad = function() {
	board = makeBoard(10,10,10);
	var c=document.getElementById("minesweeper");
	var ctx=c.getContext("2d");
	drawBoard(ctx, board, 10);
};
