document.addEventListener("DOMContentLoaded", function(event) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var ballRadius = 10;
  var ballXPosition = canvas.width/2;
  var ballYPosition = canvas.height-30;
  var ballColor = "green";
  var dXball = 2;
  var dYball = -2;

  var paddleHeight = 10;
  var paddleWidth = 75;
  var paddleX = (canvas.width-paddleWidth)/2;
  var paddleSpeed = 7;

  var rightPressed = false;
  var leftPressed = false;
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
 
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    checkInput();
    checkCollisions(moveBall);
  }
  setInterval(draw, 10);

  function moveBall() {
    ballXPosition += dXball;
    ballYPosition += dYball;
  }

  function checkCollisions(cb) {
    checkTopAndSideCollisions();  
    checkPaddleCollisions();
    checkGameOver(cb);
  }

  function checkTopAndSideCollisions() {
    if (ballXPosition + dXball > canvas.width-ballRadius  || ballXPosition + dXball < ballRadius) {
      dXball = -dXball;
      ballColor = getRandomColor();
    }

    if (ballYPosition  + dYball < ballRadius) {
      dYball = -dYball;
      ballColor = getRandomColor();
    }
  }

  function checkPaddleCollisions() {
    if (ballYPosition + dYball > (canvas.height-ballRadius) - paddleHeight) {
      if(ballXPosition > paddleX && ballXPosition < paddleX + paddleWidth) {
        dYball = -dYball;
      }
    }
  }

  function checkInput() {
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
          paddleX += paddleSpeed;
    }
    else if(leftPressed && paddleX > 0) {
          paddleX -= paddleSpeed;
    }
  }

  function checkGameOver(cb) {
    if (ballYPosition + dYball > canvas.height - ballRadius) {
      alert("GAME OVER");
      document.location.reload();
    } else {
      cb();
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballXPosition, ballYPosition, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  function keyDownHandler(e) {
    if(e.keyCode == 39) {
      rightPressed = true;
    }
    else if(e.keyCode == 37) {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if(e.keyCode == 39) {
      rightPressed = false;
    }
    else if(e.keyCode == 37) {
      leftPressed = false;
    }
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
