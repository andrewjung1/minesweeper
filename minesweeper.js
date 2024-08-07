function setup() {
  createCanvas(boardSizeX * 200, boardSizeY * 200);
  background(200);
  frameRate(30);
  textSize(200);

  tileCoordinates();
  placeBombs();
}
var tiles = [];

//var currentPlayer = "X";
var playerTilesTaken = {};

var tile0 = {
  leftX: 0,
  rightX: 200,
  topY: 0,
  bottomY: 200,
};

var boardSizeX = 4;
var boardSizeY = 4;
var bomb;
var tileClickedOn;
var tilesClickedOn = 0;
var bombCount = 5;

function draw() {
  background(200);
  board();
  flagIcon();
  gameWon();
  drawNumbers();
  mainMenu();
}

function mainMenu() {
  fill(200);
  textSize(100);
  rect(0, 0, boardSizeX * 150, boardSizeY * 200);
  fill(0);
  text("Minesweeper", boardSizeX * 100, boardSizeX * 70);
  fill(255);
  rect(boardSizeX * 100 - 150, boardSizeY * 135, 300, 100);
  fill(0);
  textSize(60);
  text("Start?", 420, 744);
  fill(255);
  textSize(200);
  if (mouseX > 1050 && mouseX < 675) {
    console.log("mouse is over hte thing");
  }
  //goes to mouse released
}

function placeBombs() {
  var unroundedBomb;
  for (var i = 0; i < bombCount; i++) {
    var bombRow;
    var bombColumn;
    unroundedBomb = random(0, 25);
    oneNumberBomb = round(unroundedBomb);
    bombRow = floor(oneNumberBomb / 5);
    bombColumn = oneNumberBomb % 5;
    tiles[bombRow][bombColumn].isBomb = true;
  }
  for (i = 0; i < boardSizeX; i++) {
    for (j = 0; j < boardSizeY; j++) {
      if (tiles[i][j].isBomb) {
        console.log("bomb is on: " + i + ", " + j);
      }
    }
  }
}

function board() {
  fill(255);
  strokeWeight(5);
  // line(0, 200, 1000, 200);
  // line(0, 400, 1000, 400);
  // line(0, 600, 1000, 600);
  // line(0, 800, 1000, 800);
  // line(200, 0, 200, 1000);
  // line(400, 0, 400, 1000);
  // line(600, 0, 600, 1000);
  // line(800, 0, 800, 1000);
  for (var i = 0; i < boardSizeX; i++) {
    line(0, i * 200, boardSizeX * 200, i * 200);
  }
  for (var j = 0; j < boardSizeY; j++) {
    line(j * 200, 0, j * 200, boardSizeY * 200);
  }
}

function mouseReleased() {
  for (i = 0; i < boardSizeX; i++) {
    for (j = 0; j < boardSizeY; j++) {
      if (
        tiles[i][j].isClicked(mouseX, mouseY, i, j) &&
        tiles[i][j].hasFlag === false &&
        tiles[i][j].hasBeenClicked === false
      ) {
        checkIfBombHasActivated();
        console.log("clicked: tiles[" + i + "][" + j + "]");
        tiles[i][j].hasBeenClicked = true;
        placeNumber(i, j);
        tilesClickedOn += 1;
      }
    }
  }
}

function placeNumber(clickedX, clickedY) {
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      if (!(j == 0 && i == 0)) {
        if (
          clickedY + j >= 0 &&
          clickedY + j <= boardSizeY - 1 &&
          clickedX + i >= 0 &&
          clickedX + i <= boardSizeX - 1
        ) {
          clickEmptyTiles;
        }
        if (tiles[i + clickedX][j + clickedY].isBomb === true) {
          tiles[clickedX][clickedY].bombsAround += 1;
          console.log("there are " + tiles[clickedX][clickedY].bombsAround);
        }
      }
    }
  }
}

function clickEmptyTiles() {
  if (tiles[clickedX][clickedY].bombsAround === 0) {
    console.log("tile is empty");
  }
}

function drawNumbers() {
  for (i = 0; i < boardSizeX; i++) {
    for (j = 0; j < boardSizeY; j++) {
      if (tiles[i][j].hasBeenClicked === true) {
        tiles[i][j].placeBombNumber(tiles[i][j].bombsAround);
      }
    }
  }
}

function checkIfBombHasActivated() {
  if (tiles[i][j].isBomb === true) {
    console.log("game lost");
  }
}
function tileCoordinates() {
  for (var y = 0; y < boardSizeX; y++) {
    var tileRow = [];
    for (var x = 0; x < boardSizeY; x++) {
      var tileForConstructor = new tileConstructor(
        x * 200,
        x * 200 + 200,
        y * 200,
        y * 200 + 200
      );
      tileRow.push(tileForConstructor);
    }
    tiles.push(tileRow);
  }
}
function keyReleased() {
  for (i = 0; i < boardSizeX; i++) {
    for (j = 0; j < boardSizeY; j++) {
      if (tiles[i][j].isClicked(mouseX, mouseY, i)) {
        if (keyCode === 32 && tiles[i][j].hasFlag === false) {
          console.log("spacebar has been pressed on tile " + i);
          tiles[i][j].hasFlag = true;
        } else if (keyCode === 32 && tiles[i][j].hasFlag === true) {
          console.log("flag has been removed");
          tiles[i][j].hasFlag = false;
        }
      }
    }
  }
}

function flagIcon() {
  for (i = 0; i < boardSizeX; i++) {
    for (j = 0; j < boardSizeY; j++) {
      if (tiles[i][j].hasFlag === true) {
        ellipse(
          (tiles[i][j].leftX + tiles[i][j].rightX) / 2,
          (tiles[i][j].topY + tiles[i][j].bottomY) / 2,
          75,
          75
        );
      }
    }
  }
}

function gameWon() {
  if (tilesClickedOn >= boardSizeX * boardSizeY - bombCount) {
    console.log("you win!");
  }
}

function tileConstructor(leftX, rightX, leftY, rightY) {
  this.leftX = leftX;
  this.rightX = rightX;
  this.topY = leftY;
  this.bottomY = rightY;
  this.hasBeenClicked = false;
  this.hasFlag = false;
  this.isBomb = false;
  this.bombsAround = 0;
  this.width = function () {
    return this.rightX - this.leftX;
  };
  this.height = function () {
    return this.bottomY - this.topY;
  };
  this.isClicked = function (mouseX, mouseY, i, j) {
    if (
      mouseX > this.leftX &&
      mouseX < this.rightX &&
      mouseY > this.topY &&
      mouseY < this.bottomY
    ) {
      return true;
    } else {
      return false;
    }
  };
  this.placeBombNumber = function (numberOfBombs) {
    textSize(40);
    text(
      numberOfBombs,
      this.leftX + this.width() / 2,
      this.topY + this.height() / 2
    );
  };
}
