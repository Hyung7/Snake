var snake = null,   // snake的实例
  food = null,      // food的实例
  game = null;      // game的实例

var score = document.getElementsByClassName("score")[0];
var over = document.getElementsByClassName("over")[0];
var overScore = document.getElementsByClassName("overScore")[0];

// 开始游戏
function startGame() {
  startBtn.style.display = "none";
  over.style.display = "none";
  game = new Game();
  game.init();
}

// start点击事件（开始游戏）
var startBtn = document.getElementsByClassName("start")[0];
startBtn.onclick = function (e) {
  // e.stopPropagation(); // 取消冒泡
  startGame();
}

// box点击事件（暂停游戏）
var box = document.getElementsByClassName("box")[0];
box.onclick = function () {
  if (game.state === "start") {
    game.pause();
  }
}

// continue点击事件（继续游戏）
var continueBtn = document.getElementsByClassName("continue")[0];
continueBtn.onclick = function (e) {
  // e.stopPropagation(); // 取消冒泡 
  game.start();
}

// 键盘事件
document.onkeydown = function (e) {
  if (e.which === 32) {   // 空格
    if (!game || game.state === "ready") {
      startGame();
    } else if (game.state === "start") {
      game.pause();
    } else if (game.state === "pause") {
      game.start();
    }
  } else if (game.key) {
    if (e.which === 38 && snake.direction !== snake.dirSet.down) { // 上
      snake.direction = snake.dirSet.up;
      game.key = false;
    } else if (e.which === 40 && snake.direction !== snake.dirSet.up) { // 下
      snake.direction = snake.dirSet.down;
      game.key = false;
    } else if (e.which === 37 && snake.direction !== snake.dirSet.right) { // 左
      snake.direction = snake.dirSet.left;
      game.key = false;
    } else if (e.which === 39 && snake.direction !== snake.dirSet.left) { // 右
      snake.direction = snake.dirSet.right;
      game.key = false;
    }
  }
}


function Square(pos, className) {
  this.x = pos[0]; // x坐标（left）
  this.y = pos[1]; // y坐标（top）
  this.className = className; // 类名
  this.ele = document.createElement("div"); // Element
}
Square.prototype.create = function () {
  this.ele.className = this.className;
  this.ele.style.left = this.x + "px";
  this.ele.style.top = this.y + "px";
  box.appendChild(this.ele); // 放入box
}

function Snake() {
  this.head = null;   // 蛇头
  this.tail = null;   // 蛇尾
  this.eyes = [];     // 眼睛
  this.bodyPos = [];  // 身体所占位置
  this.nextPos = [];  // 蛇头下一个点
  direction = {};     // 方向
  this.dirSet = {     // 方向集合
    up: {
      x: 0,
      y: -10,
      leClass: "eyes leftEyeUp",
      reClass: "eyes rightEyeUp"
    },
    down: {
      x: 0,
      y: 10,
      leClass: "eyes leftEyeUp",
      reClass: "eyes rightEyeUp"
    },
    left: {
      x: -10,
      y: 0,
      leClass: "eyes leftEyeLeft",
      reClass: "eyes rightEyeLeft"
    },
    right: {
      x: 10,
      y: 0,
      leClass: "eyes leftEyeLeft",
      reClass: "eyes rightEyeLeft"
    }
  };
}
// 初始化
Snake.prototype.init = function () {
  // 创建蛇身
  var snakeBody = [];
  for (var i = 0; i < 5; i++) {
    snakeBody[i] = new Square([270, 250 + i * 10], "snake");
    this.bodyPos.push([270, 250 + i * 10]);     // 更新蛇身所占位置
    snakeBody[i].create();
  }
  this.head = snakeBody[0];   // 更新蛇头信息
  this.tail = snakeBody[4];   // 更新蛇尾信息
  // 形成链表关系
  for (var i = 0; i < 5; i++) {
    snakeBody[i].last = snakeBody[i - 1];
    snakeBody[i].next = snakeBody[i + 1];
  }
  this.direction = this.dirSet.up;
  // 创建眼睛
  this.eyes[0] = document.createElement("i");
  this.eyes[1] = document.createElement("i");
  this.setEyesPos();
  this.setEyes();
}
// 把眼睛放入蛇头
Snake.prototype.setEyes = function () {
  this.head.ele.appendChild(this.eyes[0]);
  this.head.ele.appendChild(this.eyes[1]);
}
// 改变眼睛class
Snake.prototype.setEyesPos = function () {
  this.eyes[0].className = this.direction.leClass;
  this.eyes[1].className = this.direction.reClass;
}
// 是否与蛇身重复
Snake.prototype.isRepeat = function (pos) {
  var len = this.bodyPos.length;
  for (var i = 0; i < len; i++) {
    if (pos[0] === this.bodyPos[i][0] && pos[1] === this.bodyPos[i][1]) {
      return true;
    }
  }
  return false;
}
// 获得蛇头下一个位置坐标
Snake.prototype.getnextPos = function () {
  this.nextPos[0] = this.head.x + this.direction.x;
  this.nextPos[1] = this.head.y + this.direction.y;
}
// 移动
Snake.prototype.move = function () {
  this.getnextPos();
  if (this.isRepeat(this.nextPos) || this.nextPos[0] < 0 || this.nextPos[0] > 540 || this.nextPos[1] < 0 || this.nextPos[1] > 540) {  // 撞到自己或撞墙
    this.method.over.call(this);
  } else if (this.nextPos[0] === game.food.x && this.nextPos[1] === game.food.y) {  // 吃到食物
    this.method.food.call(this);
  } else {
    this.method.go.call(this);
  }
}
// 方法
Snake.prototype.method = {
  // 向前走一格
  go: function () {
    // 更新蛇尾坐标
    this.tail.x = this.head.x;
    this.tail.y = this.head.y;
    // 把蛇尾放到蛇头的位置
    this.tail.ele.style.left = this.tail.x + "px";
    this.tail.ele.style.top = this.tail.y + "px";
    // 更新蛇头坐标
    this.head.x = this.nextPos[0];
    this.head.y = this.nextPos[1];
    // 蛇头前移一格
    this.head.ele.style.left = this.head.x + "px";
    this.head.ele.style.top = this.head.y + "px";
    // 更新蛇身所占位置坐标
    this.bodyPos.pop();
    this.bodyPos.unshift([this.nextPos[0], this.nextPos[1]]);
    // 更新链表关系
    this.tail.last.next = null;
    this.head.next.last = this.tail;
    this.tail.next = this.head.next;
    this.head.next = this.tail;
    this.tail = this.tail.last;
    this.head.next.last = this.head;
  },
  // 吃食物
  food: function () {
    // 分数+1
    game.score++;
    game.setScore();
    game.changeFoodPos();
    // 创建新蛇头
    var snakeHead = new Square(this.nextPos, "snake");
    snakeHead.create();
    // 更新蛇身所占位置坐标
    this.bodyPos.unshift([this.nextPos[0], this.nextPos[1]]);
    // 更新链表关系
    this.head.last = snakeHead;
    snakeHead.next = this.head;
    snakeHead.last = null;
    // 更新蛇头信息
    this.head = snakeHead;
    this.setEyes();
  },
  // over
  over: function () {
    game.over();
  }
}

function Game() {
  this.timer = null;      // 定时器
  this.score = 0;         // 分数
  this.food = {};         // 食物
  this.key = true;        // 锁
  this.state = "ready";   // 游戏状态（未开始：ready，进行中：start，暂停：pause）
}
// 初始化
Game.prototype.init = function () {
  snake = new Snake();
  snake.init();
  this.createFood();
  this.setScore();
  this.start();
}
// 开始游戏
Game.prototype.start = function () {
  this.state = "start";
  continueBtn.style.display = "none";
  // 启动定时器
  this.timer = setInterval(function () {
    snake.move();
    if (!game.key) {
      snake.setEyesPos();
      game.key = true;
    }
  }, 200);
}
// 暂停游戏
Game.prototype.pause = function () {
  this.state = "pause";
  clearInterval(this.timer);
  continueBtn.style.display = "block";
}
// 游戏结束
Game.prototype.over = function () {
  this.state = "ready";
  clearInterval(this.timer);
  overScore.innerText = "分数：" + this.score;
  score.innerText = "";
  over.style.display = "block";
  startBtn.style.display = "block";
  box.innerHTML = "";
}
// 设置分数
Game.prototype.setScore = function () {
  score.innerText = "分数：" + this.score;
}
// 创建食物
Game.prototype.createFood = function () {
  this.getFoodPos();
  this.food = new Square([this.food.x, this.food.y], "food");
  this.food.create();
}
// 获得食物坐标
Game.prototype.getFoodPos = function () {
  var pos = [];
  do {
    pos[0] = Math.floor(Math.random() * 55) * 10;
    pos[1] = Math.floor(Math.random() * 55) * 10;
  } while (snake.isRepeat(pos));
  this.food.x = pos[0];
  this.food.y = pos[1];
}
// 更改食物位置
Game.prototype.changeFoodPos = function () {
  this.getFoodPos();
  this.food.ele.style.left = this.food.x + "px";
  this.food.ele.style.top = this.food.y + "px";
}