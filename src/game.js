document.addEventListener("DOMContentLoaded", function(event) {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var score = 0;
  var lives = 3;
  var playing;

  var ball = new Ball(10, canvas.width/2, canvas.height-30);
  
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

  ball.reset();
  resetBricks();
  draw();


  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    checkInput();
    checkCollisions();
    ball.move();
    playing = window.requestAnimationFrame(animate);
  }
  
  function draw() {
    drawCircle(ball);
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
  }

  function start() {
    if (!playing) {
      console.log("GO!");
      ball.reset();   
      resetBricks();
      animate();
    }
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

  function drawCircle(obj) {
    ctx.beginPath();
    ctx.arc(obj.xPos, obj.yPos, obj.radius, 0, Math.PI*2);
    ctx.fillStyle = obj.colour;
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

  function checkCollisions() {
    checkTopAndSideCollisions();  
    checkBrickCollisions();
    checkPaddleCollisions();
    checkGameOver();
  }

  function checkTopAndSideCollisions() {
    if (ball.xPos + ball.dx > canvas.width-ball.radius  || ball.xPos + ball.dx < ball.radius) {
      ball.dx = -ball.dx;
    }

    if (ball.yPos  + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    }
  }
  
  function checkPaddleCollisions() {
    if (ball.yPos + ball.dy > (canvas.height-ball.radius) - paddleHeight) {
      if(ball.xPos + ball.radius > paddleX && ball.xPos - ball.radius < paddleX + paddleWidth) {
        ball.dy = -ball.dy;
        ball.increaseSpeed();
      }
    }
  }

  function checkBrickCollisions() {
    for(c=0; c<brickColumnCount; c++) {
      for(r=0; r<brickRowCount; r++) {
        var b = bricks[c][r];
        if(b.status > 0) {
          if(ball.xPos > b.x && ball.xPos < b.x+brickWidth && ball.yPos > b.y && ball.yPos < b.y+brickHeight) {
            ball.dy = -ball.dy;
            b.status--;
            ball.newRandomColour();
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
    if (ball.yPos + ball.dy > canvas.height - ball.radius) {
      lives--;
      if (playing && !lives) {
        console.log("Game Over!");
        window.cancelAnimationFrame(playing);
        playing = undefined;
        document.location.reload();
      } else {
        ball.reset();
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
