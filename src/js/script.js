var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var  mouse = {
  x: 0,
  y: 0,

  oldX: 0,
  oldY: 0,

  update: function () {
    this.vectorX = this.x - this.oldX;
    this.vectorY = this.y - this.oldY;

    this.oldX = this.x;
    this.oldY = this.y;
  }
};

var buttonRestart = {
  x: 10,
  y: 470,
  width: 80,
  height: 20,
  color: '#2C444D',
  text: 'restart',
  textX: 20,
  textY: 486,
  textColor: '#0095DD',
  font: '20px Georgia',
  pressed: false
};

function Ball(x, y, size = 15, color = '#0095DD') {
  this.x = x;
  this.y = y;
  this.size = size;
  this.color = color;
  this.selected = false;
  this.vectorX = 1;
  this.vectorY = 1;
}

var balls = [];

if (localStorage.getItem('savedData')) {
  balls = JSON.parse(localStorage.getItem('savedData'));
} else {
  addBalls();
}

function addBalls(value = 6) {
  for (var i = 0; i < value; i++) {
    balls.push(new Ball(30 + (40 * i), 200));
  }
}

document.addEventListener('mousemove', mouseMoveHandler);
document.addEventListener('mouseup', mouseUpHandler);
document.addEventListener('mousedown', mouseDownHandler);

function mouseMoveHandler(e) {
  var cnvX = e.clientX - canvas.offsetLeft;
  var cnvY = e.clientY - canvas.offsetTop;
  mouse.x = cnvX;
  mouse.y = cnvY;
  balls.forEach(function (ball) {
    if (ball.selected) {
      ball.x = mouse.x - ball.shiftX;
      ball.y = mouse.y - ball.shiftY;
      ball.vectorX = mouse.vectorX * 0.3;
      ball.vectorY = mouse.vectorY * 0.3;
    }
  });
}

function mouseUpHandler() {
  isCursorOnBall();
  buttonRestart.pressed = false;
}

function mouseDownHandler() {
  isCursorOnBall();
  isRestartPressed();
}

function isRestartPressed() {
  if (mouse.x > buttonRestart.x &&
    mouse.x < buttonRestart.x + buttonRestart.width &&
    mouse.y < buttonRestart.y + buttonRestart.height &&
    mouse.y > buttonRestart.y) {
    buttonRestart.pressed = true;
    balls = [];
    addBalls();
  }
}

function isCursorOnBall() {
  balls.forEach(function (ball) {
    var dx2 = Math.pow((mouse.x - ball.x), 2);
    var dy2 = Math.pow((mouse.y - ball.y), 2);
    var dist = Math.sqrt(dx2 + dy2);
    if (dist <= ball.size) {
      ball.selected = !ball.selected;
      ball.shiftX = mouse.x - ball.x;
      ball.shiftY = mouse.y - ball.y;
    }
  });
}

function moveBalls(maxSpeed = 4) {
  for (var i = 0; i < balls.length; i++) {
    for (var j = 1; j < balls.length; j++) {
      if (balls[i].x > canvas.width / 2 && !balls[i].selected) {
        if (balls[i].x + balls[i].vectorX > canvas.width - balls[i].size ||
          balls[i].x + balls[i].vectorX < canvas.width / 2 + balls[i].size) {
          balls[i].vectorX = -balls[i].vectorX;
        }
        if (balls[i].y + balls[i].vectorY > canvas.height - balls[i].size ||
          balls[i].y + balls[i].vectorY < balls[i].size) {
          balls[i].vectorY = -balls[i].vectorY;
        }
        if (isCollised(balls[i], balls[j])) {
          balls[i].vectorX = -balls[i].vectorX;
          balls[i].vectorY = -balls[i].vectorY;
          balls[j].vectorX = -balls[j].vectorX;
          balls[j].vectorY = -balls[j].vectorY;
        }
        if (Math.abs(balls[i].vectorX) > maxSpeed) {
          balls[i].vectorX = maxSpeed;
        }
        if (Math.abs(balls[i].vectorY) > maxSpeed) {
          balls[i].vectorY = maxSpeed;
        }
        balls[i].x += balls[i].vectorX;
        balls[i].y += balls[i].vectorY;
      }
    }
  }
}

function isCollised(b1, b2) {
  var dx2 = Math.pow((b1.x - b2.x), 2);
  var dy2 = Math.pow((b1.y - b2.y), 2);
  var dist = Math.sqrt(dx2 + dy2);
  if (dist <= b1.size + b2.size && dist > 0) {
    return true;
  }
  return false;
}

function drawButton() {
  if (buttonRestart.pressed) {
    ctx.beginPath();
    ctx.strokeStyle = buttonRestart.color;
    ctx.strokeRect(buttonRestart.x + 2, buttonRestart.y + 1, buttonRestart.width - 4, buttonRestart.height - 2);
    ctx.font = '18px Georgia';
    ctx.fillStyle = buttonRestart.textColor;
    ctx.fillText(buttonRestart.text, buttonRestart.textX + 3, buttonRestart.textY - 1);
    ctx.closePath();
  } else {
    ctx.beginPath();
    ctx.strokeStyle = buttonRestart.color;
    ctx.strokeRect(buttonRestart.x, buttonRestart.y, buttonRestart.width, buttonRestart.height);
    ctx.font = buttonRestart.font;
    ctx.fillStyle = buttonRestart.textColor;
    ctx.fillText(buttonRestart.text, buttonRestart.textX, buttonRestart.textY);
    ctx.closePath();
  }
}

function drawTable() {
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  ctx.font = '32px Georgia';
  ctx.fillText('Static block', 100, 30);
  ctx.fillText('Bouncing block', 500, 30);

  drawButton();
}

function drawBalls() {
  balls.forEach(function (ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTable();
  drawBalls();
  mouse.update();
  moveBalls();
  localStorage.setItem('savedData', JSON.stringify(balls));
}

setInterval(draw, 1000 / 60);
