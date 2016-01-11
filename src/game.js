document.addEventListener("DOMContentLoaded", function(event) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var score = 0;
  var lives = 3;
  var playing;

  var ballRadius = 10;
  var ballX = canvas.width/2;
  var ballY = canvas.height-30;
  var ballColor = "black";
  var dXball = 1;
  var dYball = -1;
  var speedIncrease = 0.5;

  var paddleHeight = 2;
  var paddleWidth = 75;
  var paddleX = (canvas.width-paddleWidth)/2;
  var paddleSpeed = 7;

  var bricks;
  var brickLives = 3;
  var brickRowCount = 3;
  var brickColumnCount = 5;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 25;
  var brickOffsetLeft = 30;
  var brickColours = ["#1aff1a", "#80ff80", "#e5ffe5"];

  var START_KEY = 32;
  var rightPressed = false;
  var leftPressed = false;
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  resetBall();
  resetBricks();
  draw();


  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    checkInput();
    checkCollisions();
    moveBall();
    playing = window.requestAnimationFrame(animate);
  }
  
  function draw() {
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
  }

  function start() {
    if (!playing) {
      console.log("GO!");
      resetBall();   
      resetBricks();
      animate();
    }
  }

  function resetBall() {
    ballX = canvas.width/2;
    ballY = canvas.height-30;
    dXball = 2;
    dYball = -2;
  }

  function resetBricks() {
    bricks = [];
    for(c=0; c<brickColumnCount; c++) {
      bricks[c] = [];
      for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: brickLives };
      }
    }
  }

  function resetPaddle() {
    paddleX = (canvas.width-paddleWidth)/2;
  }

  function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
  }

  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
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
  
  function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
      for(r=0; r<brickRowCount; r++) {
        if(bricks[c][r].status > 0) {
          var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
          var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = brickColours[brickLives - bricks[c][r].status];
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function moveBall() {
    ballX += dXball;
    ballY += dYball;
  }

  function checkCollisions() {
    checkTopAndSideCollisions();  
    checkBrickCollisions();
    checkPaddleCollisions();
    checkGameOver();
  }

  function checkTopAndSideCollisions() {
    if (ballX + dXball > canvas.width-ballRadius  || ballX + dXball < ballRadius) {
      dXball = -dXball;
    }

    if (ballY  + dYball < ballRadius) {
      dYball = -dYball;
    }
  }
  
  function increaseSpeed() {
    dYball += (dYball > 0) ? speedIncrease : -speedIncrease;
    dXball += (dXball > 0) ? speedIncrease : -speedIncrease;
  }

  function checkPaddleCollisions() {
    if (ballY + dYball > (canvas.height-ballRadius) - paddleHeight) {
      if(ballX + ballRadius > paddleX && ballX - ballRadius < paddleX + paddleWidth) {
        dYball = -dYball;
        increaseSpeed();
      }
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

  function checkBrickCollisions() {
    for(c=0; c<brickColumnCount; c++) {
      for(r=0; r<brickRowCount; r++) {
        var b = bricks[c][r];
        if(b.status > 0) {
          if(ballX > b.x && ballX < b.x+brickWidth && ballY > b.y && ballY < b.y+brickHeight) {
            dYball = -dYball;
            b.status--;
            ballColor = getRandomColor();
            score++;
            checkWin();
          }
        }
      }
    }
  }

  function checkInput() {
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
          paddleX += paddleSpeed;
    }
    else if(leftPressed && paddleX > 0) {
          paddleX -= paddleSpeed;
    }
  }

  function checkGameOver() {
    if (ballY + dYball > canvas.height - ballRadius) {
      lives--;
      if (playing && !lives) {
        console.log("Game Over!");
        window.cancelAnimationFrame(playing);
        playing = undefined;
        document.location.reload();
      } else {
        resetBall();
        resetPaddle();
      }
    }
  }

  function checkWin() {
    if(score == brickLives * brickRowCount*brickColumnCount) {
      console.log("YOU WIN, CONGRATULATIONS!");
      window.cancelAnimationFrame(playing);
      playing = undefined;
      document.location.reload();
    }
  }

  function keyDownHandler(e) {
    if (e.keyCode == START_KEY) {
      start();
    } else if (e.keyCode == 39) {
      rightPressed = true;
    }
    else if (e.keyCode == 37) {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = false;
    }
    else if (e.keyCode == 37) {
      leftPressed = false;
    }
  }

  function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
    }
  }
});
