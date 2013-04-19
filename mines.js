var CLEAR = 0;
var MINE = 0x1;
var FLAG = 0x10;
var REVEALED = 0x100;

var CELL_WIDTH = 20;
var CELL_HEIGHT = 20;

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

var callAdjacent = function(board, row, col, fn) {
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			if (i != 0 || j != 0) {
				if (row + i >= 0 && row + i < board.length) {
					if (col + j >= 0 && col + j < board[row+i].length) {
						fn(board, row+i, col+j);
					}
				}
			}
		}
	}
}

var adjacentMines = function(board, row, col) {
	var mineCount = 0;
	callAdjacent(board, row, col, function(brd, r,c) {
		if (brd[r][c] & MINE) {
			mineCount++;
		}
	});
	return mineCount;
};

var revealAdjacentZeroes = function(board, row, col) {
	callAdjacent(board, row, col, function(brd,r,c) {
		if (!(brd[r][c] & REVEALED)) {
			brd[r][c] = brd[r][c] | REVEALED;
			if (adjacentMines(brd, r, c) == 0) {
				revealAdjacentZeroes(brd,r, c);
			}
		}
	});
};

var localCoords = function(e, element) {
	return { x: e.pageX - element.offsetLeft, y: e.pageY - element.offsetTop };
};

var cellForClick = function(e, element) {
	var coords = localCoords(e, element);
	return { row: Math.floor(coords.y / CELL_HEIGHT), col: Math.floor(coords.x / CELL_WIDTH) };
};

var leftClick = function(board, e) {
	var cell = cellForClick(e, e.currentTarget);
	if (board.length == 0) {
		board = makeBoard(10,10,10, cell);
	}
	board[cell.row][cell.col] = board[cell.row][cell.col] | REVEALED;
	if (adjacentMines(board, cell.row, cell.col) == 0 && !(board[cell.row][cell.col] & MINE)) {
		revealAdjacentZeroes(board, cell.row, cell.col);
	}
	updateBoard(board);
	if (board[cell.row][cell.col] & MINE && !(board[cell.row][cell.col] & FLAG)) {
		alert("You lose!");
	}
	return board;
};

var rightClick = function(board, e) {
	if (board.length == 0) {
		return false;
	}
	var cell = cellForClick(e, e.currentTarget);
	if (board[cell.row][cell.col] & REVEALED) {
		return false;
	}
	board[cell.row][cell.col] = board[cell.row][cell.col] ^ FLAG;
	updateBoard(board);
	return false;
};

var updateBoard = function(board) {
	var canvas = document.getElementById("minesweeper");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBoard(ctx, board);
};

var drawBoard = function(ctx, board) {
	for (var row = 0; row < board.length; row++) {
		for (var col = 0; col < board[row].length; col++) {
			ctx.fillStyle = "grey";
			var cell = board[row][col];
			if (cell & FLAG) {
				ctx.fillStyle = "red";
			}
			else if (cell & REVEALED) {
				if (cell & MINE) {
					ctx.fillStyle = "black";
				}
				else {
					ctx.fillStyle = "white";
				}
			}
			ctx.fillRect(col*CELL_WIDTH, row*CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
			ctx.rect(col*CELL_WIDTH, row*CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
			ctx.strokeStyle = "black";
			ctx.stroke();
			if (cell & REVEALED && !(cell & MINE)) {
				var mines = adjacentMines(board, row, col);
				if (mines > 0) {
					ctx.textAlign = "center";
					var x = col * CELL_WIDTH + Math.floor(CELL_WIDTH / 2);
					var y = row * CELL_HEIGHT + Math.floor(CELL_HEIGHT / 2);
					ctx.strokeText(mines.toString(), x, y);
				}
			}
		}
	}
};

var onLoad = function() {
	var board = [];
	var canvas = document.getElementById("minesweeper");
	myRightClick = function(e) { return rightClick(board, e); }
	canvas.addEventListener("click", function(e) { board = leftClick(board, e); }, false);
};
