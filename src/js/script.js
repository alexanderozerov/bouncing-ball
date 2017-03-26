var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var  mouse = {
  x: 0,
  y: 0
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
  for (var i = 0; i < 9; i++) {
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
    }
  });
}

function mouseUpHandler() {
  isCursorOnBall();
}

function mouseDownHandler() {
  isCursorOnBall();
}

function isCursorOnBall() {
  balls.forEach(function (ball) {
    var dx2 = Math.pow((mouse.x - ball.x), 2);
    var dy2 = Math.pow((mouse.y - ball.y), 2);
    var dist = Math.sqrt(dx2 + dy2);
    if (dist <= ball.size) {
      ball.selected = ball.selected ? false : true;
      ball.shiftX = mouse.x - ball.x;
      ball.shiftY = mouse.y - ball.y;
    }
  });
}

function splitTable() {
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.closePath();
}

function drawBalls() {
  balls.forEach(function (ball) {
    if (ball.x > canvas.width / 2 && !ball.selected) {
      if (ball.x + ball.vectorX > canvas.width - ball.size || ball.x + ball.vectorX < canvas.width / 2 + ball.size) {
        ball.vectorX = -ball.vectorX;
      }
      if (ball.y + ball.vectorY > canvas.height - ball.size || ball.y + ball.vectorY < ball.size) {
        ball.vectorY = -ball.vectorY;
      }
      ball.x += ball.vectorX;
      ball.y += ball.vectorY;
    }
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  splitTable();
  drawBalls();
  localStorage.setItem('savedData', JSON.stringify(balls));
}

setInterval(draw, 1000 / 60);
