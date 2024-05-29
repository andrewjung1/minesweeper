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
      console.log(bombRow);
      console.log(bombColumn);
    }
  }
}
var tiles = [];

//var currentPlayer = "X";
var playerTilesTaken = {};

var tile0 = {
  leftX: 0,
  rightX: 200,
  leftY: 0,
  rightY: 200,
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
        tiles[i][j].hasFlag === false
      ) {
        placeNumber(i, j);
        tiles[i][j].hasBeenClicked = true;
        tilesClickedOn += 1;
        console.log(tiles[i][j].bombsAround);
      }
    }
  }
}

function placeNumber(i, j) {
  for (var x = -1; x < 1; x++) {
    for (var y = -1; y < 1; y++) {
      if (x != 0 && y != 0) {
        if (i + x >= 0 && i + x <= 2 && j + y >= 0 && j + y <= 2) {
          if ((tiles[i + x][j + y] = tiles[bombRow][bombColumn])) {
            // Andrew: come back to this
            tiles[i][j].bombsAround += 1;
          }
        }
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
          (tiles[i][j].rightY + tiles[i][j].leftY) / 2,
          75,
          75
        );
      }
    }
  }
}

function gameWon() {
  if (tilesClickedOn >= 8) {
    console.log("you win!");
  }
}

function gameLost() {
  console.log("you lost");
}

function tileConstructor(leftX, rightX, leftY, rightY) {
  this.leftX = leftX;
  this.rightX = rightX;
  this.leftY = leftY;
  this.rightY = rightY;
  this.hasBeenClicked = false;
  this.hasFlag = false;
  this.bombsAround = 0;
  this.width = function () {
    return this.rightX - this.leftX;
  };
  this.height = function () {
    return this.rightY - this.leftY;
  };
  this.isClicked = function (mouseX, mouseY, i, j) {
    if (
      mouseX > this.leftX &&
      mouseX < this.rightX &&
      mouseY > this.leftY &&
      mouseY < this.rightY
    ) {
      return true;
    } else {
      return false;
    }
  };
}
