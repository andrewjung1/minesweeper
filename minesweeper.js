function setup() {
  createCanvas(600, 600);
  background(200);
  frameRate(30);
  textSize(200);
  var unroundedBomb;

  unroundedBomb = random(0, 8);
  bomb = round(unroundedBomb);
  console.log(bomb);
}
var tile = [];
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

function draw() {
  background(200);
  board();
  tileCoordinates();
  flagIcon();
}

function board() {
  fill(255);
  line(0, 200, 600, 200);
  line(0, 400, 600, 400);
  line(200, 0, 200, 600);
  line(400, 0, 400, 600);
}

function mouseReleased() {
  for (i = 0; i < 9; i++) {
    if (tile[i].isClicked(mouseX, mouseY, i) && tile[i].hasFlag === false) {
      checkIfBombHasActivated();
      tile[i].hasBeenClicked = true;
    }
  }
}

function checkIfBombHasActivated() {
  if (tile[bomb].hasBeenClicked === true) {
    console.log("bomb has been clicked");
    console.log("bomb is " + bomb);
  }
}
function tileCoordinates() {
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 3; x++) {
      var tileForConstructor = new tileConstructor(
        x * 200,
        x * 200 + 200,
        y * 200,
        y * 200 + 200
      );
      tile.push(tileForConstructor);
    }
  }
}

function keyReleased() {
  for (i = 0; i < 9; i++) {
    if (tile[i].isClicked(mouseX, mouseY, i)) {
      if (keyCode === 32 && tile[i].hasFlag === false) {
        console.log("spacebar has been pressed on tile " + i);
        tile[i].hasFlag = true;
      } else if (keyCode === 32 && tile[i].hasFlag === true) {
        console.log("flag has been removed");
        tile[i].hasFlag = false;
      }
    }
  }
}

function flagIcon() {
  for (i = 0; i < 9; i++) {
    if (tile[i].hasFlag === true) {
      ellipse(
        (tile[i].leftX + tile[i].rightX) / 2,
        (tile[i].rightY + tile[i].leftY) / 2,
        75,
        75
      );
    }
  }
}

function tileConstructor(leftX, rightX, leftY, rightY) {
  this.leftX = leftX;
  this.rightX = rightX;
  this.leftY = leftY;
  this.rightY = rightY;
  this.hasBeenClicked = false;
  this.hasFlag = false;
  this.width = function () {
    return this.rightX - this.leftX;
  };
  this.height = function () {
    return this.rightY - this.leftY;
  };
  this.isClicked = function (mouseX, mouseY, i) {
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
