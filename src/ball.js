function Ball(radius, xPos, yPos) {
  this.radius = radius;
  this.startxPos = xPos;
  this.startyPos = yPos;
  this.xPos = xPos;
  this.yPos = yPos;
  this.colour = "black";
  this.dx = 1;
  this.dy = -1;
  this.speedIncrease = 0.5;
}

Ball.prototype.reset = function() {
  this.xPos= this.startxPos;
  this.yPos= this.startyPos;
  this.dx = 1;
  this.dy = -1;
};

Ball.prototype.move = function() {
  this.xPos += this.dx;
  this.yPos += this.dy;
};

Ball.prototype.newRandomColour = function() {
  this.colour = this.getRandomColor();
};

Ball.prototype.getRandomColor = function() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

Ball.prototype.increaseSpeed = function() {
  this.dy += (this.dy > 0) ? this.speedIncrease : -this.speedIncrease;
  this.dx += (this.dx > 0) ? this.speedIncrease : -this.speedIncrease;
};
