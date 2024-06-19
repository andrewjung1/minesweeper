function setup() {
  createCanvas(600, 600);
  background(200);
  frameRate(30);
  textSize(200);
  var unroundedBomb;
  var bombCount = 1;
  placeBombs();
  function placeBombs() {
    for (var i = 0; i < bombCount; i++) {
      unroundedBomb = random(0, 8);
      oneNumberBomb = round(unroundedBomb);
      bombRow = floor(oneNumberBomb / 3);
      bombColumn = oneNumberBomb % 3;
      console.log("bomb is on, " + bombRow + "," + bombColumn);
    }
  }
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

var bomb;

var tileClickedOn;

var tilesClickedOn = 0;

var bombRow;

var bombColumn;

function draw() {
  background(200);
  board();
  tileCoordinates();
  flagIcon();
  gameWon();
  checkIfBombHasActivated();
  drawNumbers();
}

function board() {
  fill(255);
  line(0, 200, 600, 200);
  line(0, 400, 600, 400);
  line(200, 0, 200, 600);
  line(400, 0, 400, 600);
}

function mouseReleased() {
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      if (
        tiles[i][j].isClicked(mouseX, mouseY, i, j) &&
        tiles[i][j].hasFlag === false &&
        tiles[i][j].hasBeenClicked === false
      ) {
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
          clickedY + j <= 2 &&
          clickedX + i >= 0 &&
          clickedX + i <= 2
        ) {
          if (j + clickedY === bombColumn) {
            if (i + clickedX === bombRow) {
              tiles[clickedX][clickedY].bombsAround += 1;
              console.log("there are " + tiles[clickedX][clickedY].bombsAround);
            }
          }
        }
      }
    }
  }
}

function drawNumbers() {
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      if (tiles[i][j].hasBeenClicked === true) {
        tiles[i][j].placeBombNumber(tiles[i][j].bombsAround);
      }
    }
  }
}

function checkIfBombHasActivated() {
  if (tiles[bombRow][bombColumn].hasBeenClicked === true) {
    console.log("game lost");
  }
}
function tileCoordinates() {
  for (var y = 0; y < 3; y++) {
    var tileRow = [];
    for (var x = 0; x < 3; x++) {
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
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
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
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
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
  if (tilesClickedOn > 7) {
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
  this.placeBombNumber = function () {
    textSize(40);
    text(
      this.bombsAround,
      this.leftX + this.width() / 2,
      this.topY + this.height() / 2
    );
  };
}
