var CLEAR = 0;
var MINE = 0x1;
var FLAG = 0x10;
var REVEALED = 0x100;

var CELL_WIDTH = 20;
var CELL_HEIGHT = 20;

var canvas = null;
var board = null;

var makeBoard = function(width, height, mines, startCell) {
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
		if (board[y][x] == CLEAR && !(y == startCell.row && x == startCell.col)) {
			board[y][x] = MINE;
			minesPlaced++;
		}
	}
	return board;
};

var callAdjacent = function(row, col, fn) {
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			if (i != 0 || j != 0) {
				if (row + i >= 0 && row + i < board.length) {
					if (col + j >= 0 && col + j < board[row+i].length) {
						fn(row+i, col+j);
					}
				}
			}
		}
	}
}

var adjacentMines = function(row, col) {
	var mineCount = 0;
	callAdjacent(row, col, function(r,c) {
		if (board[r][c] & MINE) {
			mineCount++;
		}
	});
	return mineCount;
}

var localCoords = function(e, element) {
	return { x: e.pageX - element.offsetLeft, y: e.pageY - element.offsetTop };
};

var cellForClick = function(e) {
	var coords = localCoords(e, canvas);
	return { row: Math.floor(coords.y / CELL_HEIGHT), col: Math.floor(coords.x / CELL_WIDTH) };
};

var revealAdjacentZeroes = function(row, col) {
	callAdjacent(row, col, function(r,c) {
		if ((board[r][c] & REVEALED) == 0) {
			board[r][c] = board[r][c] | REVEALED;
			if (adjacentMines(r, c) === 0) {
				revealAdjacentZeroes(r, c);
			}
		}
	});
};

var leftClick = function(e) {
	var cell = cellForClick(e);
	if (board == null) {
		board = makeBoard(10,10,10, cell);
	}
	if (board[cell.row][cell.col] & MINE) {
		alert('You lose!');
	}
	else {
		board[cell.row][cell.col] = board[cell.row][cell.col] | REVEALED;
		if (adjacentMines(cell.row, cell.col) == 0) {
			revealAdjacentZeroes(cell.row, cell.col);
		}
	}
	updateBoard();
	return false;
};

var rightClick = function(e) {
	if (board == null) {
		return false;
	}
	var cell = cellForClick(e);
	if (board[cell.row][cell.col] & REVEALED) {
		return false;
	}
	board[cell.row][cell.col] = board[cell.row][cell.col] | FLAG;
	updateBoard();
	return false;
};

var updateBoard = function() {
	var ctx = canvas.getContext("2d");
	drawBoard(ctx, board);
};

var drawBoard = function(ctx, board) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for (var row = 0; row < board.length; row++) {
		for (var col = 0; col < board[row].length; col++) {
			ctx.fillStyle="white";
			var cell = board[row][col];
			if (cell & FLAG) {
				ctx.fillStyle="red";
				ctx.fillRect(col*CELL_WIDTH, row*CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
			}
			else if (cell & REVEALED) {
				if (cell & MINE) {
					ctx.fillStyle = "black";
					ctx.fillRect(col*CELL_WIDTH, row*CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
				}
				else {
					var text = adjacentMines(row, col).toString();
					ctx.textAlign = 'center';
					var x = col * CELL_WIDTH + Math.floor(CELL_WIDTH / 2);
					var y = row * CELL_HEIGHT + Math.floor(CELL_HEIGHT / 2);
					console.log("num: " + x + "," + y);
					ctx.fillStyle="black";
					ctx.fillText(text, x, y);
				}
			}
		}
	}
};

var onLoad = function() {
	canvas = document.getElementById("minesweeper");
	canvas.addEventListener('click', leftClick, false);
	canvas.addEventListener('contextmenu', rightClick, false);
};
