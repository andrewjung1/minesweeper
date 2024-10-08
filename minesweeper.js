// to do
// make it so that when you click on a zero it does the entire tile thing until it reaches a tile with a bomb nearby it or it reaches a bomb
//

function setup() {
  createCanvas(boardSizeX * 200, boardSizeY * 200);
  background(200);
  frameRate(30);
  textSize(200);
  tileCoordinates();
  placeBombs();
}
var tiles = [];

var playerTilesTaken = {};

var tile0 = {
  leftX: 0,
  rightX: 200,
  topY: 0,
  bottomY: 200,
};

var boardSizeX = 5;
var boardSizeY = 5;
//current tile clicked on
var tileClickedOn;
//used to see if you have won the game
var tilesClickedOn = 0;
var bombCount = 1;
//only for main menu
var gameHasStarted = true;

function draw() {
  background(200);
  board();
  flagIcon();
  gameWon();
  drawNumbers();
  //mainMenu();
}

function mainMenu() {
  if (gameHasStarted === false) {
    fill(200);
    textSize(100);
    rect(0, 0, boardSizeX * 200, boardSizeY * 200);
    fill(0);
    text("Minesweeper", boardSizeX * 46, boardSizeX * 70);
    fill(255);
    rect(boardSizeX * 100 - 150, boardSizeY * 135, 300, 100);
    fill(0);
    textSize(60);
    text("Start?", boardSizeX * 84, boardSizeY * 149);
    fill(255);
    textSize(200);
  }
}

function placeBombs() {
  for (var i = 0; i < bombCount; i++) {
    var bombRow;
    var bombColumn;

    bombRow = round(random(0, boardSizeX - 1));
    bombColumn = round(random(0, boardSizeY - 1));

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
  if (gameHasStarted) {
    for (var i = 0; i < boardSizeX; i++) {
      line(0, i * 200, boardSizeX * 200, i * 200);
    }
    for (var j = 0; j < boardSizeY; j++) {
      line(j * 200, 0, j * 200, boardSizeY * 200);
    }
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
        checkIfClickedOnBomb(i, j);
        // console.log("clicked: tiles[" + i + "][" + j + "]");
        calculateBombsAroundTile(i, j);
        tiles[i][j].hasBeenClicked = true;
        //console.log("placed number on original clicked tile");
        if (tiles[i][j].bombsAround === 0) {
        }
        tilesClickedOn += 1;
      }
    }
  }
  if (
    mouseX > boardSizeX * 100 - 150 &&
    mouseX < boardSizeX * 100 - 150 + 300 &&
    mouseY > boardSizeY * 135 &&
    mouseY < boardSizeY * 135 + 100 &&
    gameHasStarted === false
  ) {
    gameHasStarted = true;
  }
}

function calculateBombsAroundTile(clickedX, clickedY) {
  if (clickedX < 0 || clickedY < 0) {
    return;
  }
  console.log("Calculating bombs on X =", clickedX, " Y =", clickedY);
  var currentX = 0;
  var currentY = 0;
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      currentX = clickedX + i;
      currentY = clickedY + j;
      if (!(j == 0 && i == 0)) {
        if (
          currentY >= 0 &&
          currentY <= boardSizeY - 1 &&
          currentX >= 0 &&
          currentX <= boardSizeX - 1
        ) {
          if (
            tiles[currentX][currentY].isBomb === true &&
            tiles[clickedX][clickedY].numberHasBeenAssigned === false
          ) {
            tiles[clickedX][clickedY].bombsAround += 1;
          }
        }
      }
    }
    if (tiles[clickedX][clickedY].bombsAround === 0) {
      for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
          calculateBombsAroundTile(i + clickedX, j + clickedY);
        }
      }
    }
  }
  tiles[clickedX][clickedY].numberHasBeenAssigned = true;
  console.log(
    "placed ",
    tiles[clickedX][clickedY].bombsAround,
    " bombs on ",
    clickedX,
    ", ",
    clickedY
  );
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

function checkIfClickedOnBomb(tileX, tileY) {
  if (tiles[tileX][tileY].isBomb === true) {
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
          console.log("spacebar has been pressed on tile " + j, i);
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
  this.numberHasBeenAssigned = false;
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
