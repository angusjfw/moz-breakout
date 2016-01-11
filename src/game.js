document.addEventListener("DOMContentLoaded", function(event) {

  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var ballRadius = 10;
  var ballXPosition = canvas.width/2;
  var ballYPosition = canvas.height-30;
  var ballColor = "green";

  var dXball = 2;
  var dYball = -2;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    ballXPosition += dXball;
    ballYPosition += dYball;

    if(ballXPosition + dXball > canvas.width-ballRadius  || ballXPosition + dXball < ballRadius) {
      dXball = -dXball;
      ballColor = getRandomColor();
    }

    if(ballYPosition + dYball > canvas.height-ballRadius || ballYPosition  + dYball < ballRadius) {
      dYball = -dYball;
      ballColor = getRandomColor();
    }
  }

  setInterval(draw, 10);

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballXPosition, ballYPosition, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

});
