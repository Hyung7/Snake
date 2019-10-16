var direction = null,
  key = false,
  timer,
  score,
  snake = [],
  eyes = [],
  food;
var content = document.getElementsByClassName("content")[0];
var scoreTag = document.getElementsByClassName("score")[0];
var start = content.getElementsByClassName("start")[0];
var over = content.getElementsByClassName("over")[0];
var overScore = over.getElementsByClassName("overScore")[0];

// 生成蛇
function createSnake() {
  for (var i = 0; i < 5; i++) {
    snake[i] = document.createElement("div");
    snake[i].className = "snake";
    snake[i].style.left = "270px";
    snake[i].style.top = 250 + i * 10 + "px";
    content.appendChild(snake[i]);
  }
  // 生成眼睛
  eyes[0] = document.createElement("i");
  eyes[1] = document.createElement("i");
  eyes[0].className = "eyes leftEyeUp";
  eyes[1].className = "eyes rightEyeUp";
  snake[0].appendChild(eyes[0]);
  snake[0].appendChild(eyes[1]);
}

// 判断是否符合规则
function isFit(left, top) {
  if (left > 540 || top > 540 || isSnakeRepeat(left, top)) {
    return false;
  }
  return true;
}

// 改变食物位置
function changeFoodPosition() {
  var left,
    top;
  do {
    left = Math.floor(Math.random() * 100) * 10;
    top = Math.floor(Math.random() * 100) * 10;
  }
  while (!isFit(left, top));
  food.style.left = left + "px";
  food.style.top = top + "px";
}

// 初始化 
function init () {
  createSnake();
  food = document.createElement("div");
  food.className = "food";
  content.appendChild(food);
  changeFoodPosition();
  direction = "up";
  key = true;
  score = 0;
  scoreTag.innerText = "分数：" + score;
  // 移动定时器
  timer = setInterval(function () {
      move();
  }, 200)
}

// 开始游戏，start点击事件
start.onclick = function () {
  start.style.display = "none";
  over.style.display = "none";
  init();
}

// 键盘事件（上下左右）
document.onkeydown = function (e) {
  if (key) {
    switch (e.which) {
      case 38: //上
        if (direction !== "up" && direction !== "down") {
          direction = "up";
          key = false;
        }
        break;
      case 40: //下
        if (direction !== "up" && direction !== "down" && direction) {
          direction = "down";
          key = false;
        }
        break;
      case 37: //左
        if (direction !== "left" && direction !== "right") {
          direction = "left";
          key = false;
        }
        break;
      case 39: //右
        if (direction !== "left" && direction !== "right") {
          direction = "right";
          key = false;
        }
        break;
    }
  }
}

// 是否与蛇身重复
function isSnakeRepeat(left, top) {
  for (var i = 0; i < snake.length; i++) {
    if (snake[i].offsetLeft === left && snake[i].offsetTop === top) {
      return true;
    }
  }
  return false;
}

// 改变眼睛
function changeEyes() {
  if (direction === "up" || direction === "down") {
    eyes[0].className = "eyes leftEyeUp";
    eyes[1].className = "eyes rightEyeUp";
  } else if (direction === "left" || direction === "right") {
    eyes[0].className = "eyes leftEyeLeft";
    eyes[1].className = "eyes rightEyeLeft";
  }
}
// 撞死
function gameOver () {
  clearInterval(timer);
  scoreTag.innerText = "";
  over.style.display = "block";
  overScore.innerText = "分数：" + score;
  start.style.display = "block";
  start.className = "start btn overStart";
  for (var i = 0; i < snake.length; i++) {
    snake[i].remove();
  }
  food.remove();
  snake = [];
  food = null;
}

// 移动
function move() {
  var left = snake[0].offsetLeft,
    top = snake[0].offsetTop;
  if (direction === "up") {
    top -= 10;
  } else if (direction === "down") {
    top += 10;
  } else if (direction === "left") {
    left -= 10;
  } else if (direction === "right") {
    left += 10;
  }
  // 是否撞死
  if (top > 540 || top < 0 || left > 540 || left < 0 || isSnakeRepeat(left, top)) {
    gameOver();
  } else {
    // 是否吃到食物
    if (left === food.offsetLeft && top === food.offsetTop) {
      snake[snake.length] = snake[snake.length - 1].cloneNode(true);
      content.appendChild(snake[snake.length - 1]);
      changeFoodPosition();
      score++;
      scoreTag.innerText = "分数：" + score;
    }
    for (var i = snake.length - 1; i > 0; i--) {
      snake[i].style.left = snake[i - 1].style.left;
      snake[i].style.top = snake[i - 1].style.top;
    }
    snake[0].style.left = left + "px";
    snake[0].style.top = top + "px";
    if (!key) {
      changeEyes();
      key = true;
    }
  }
}