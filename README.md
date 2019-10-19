# 原生JS实现贪吃蛇
---
### 大概思路：
点击“开始游戏”按钮开始游戏，游戏上方为分数。创建五个小方块作为蛇身，并为蛇身建立链表关系，然后创建食物。按方向键时改变蛇前进方向，同时改变眼睛的位置。移动时，将蛇尾放到蛇头前面作为新蛇头，并更新链表关系，将眼睛放入新蛇头。吃到食物时分数加一，创建一个新蛇头放到旧蛇头前面，并更新链表关系，将眼睛放入新蛇头，更新食物位置。点击游戏区或按空格，暂停游戏，显示“继续游戏”按钮，点击“继续游戏”按钮或按空格继续游戏。撞到墙壁或自己时，游戏结束，隐藏游戏上方分数，显示“游戏结束”字样、最终分数和“开始游戏”按钮。
---
### 详细代码： 
#### 一、变量声明：
var snake = null, // snake的实例
food = null, // food的实例
game = null; // game的实例
#### 二、Square构造函数
##### 1.创建构造函数Square，用于创建蛇身和食物
function Square(pos, className) {
  this.x = pos[0]; // left值
  this.y = pos[1]; // top值
  this.className = className; // 类名
}
##### 2.在Square的原型上创建create方法，用于创建元素，并将元素插入box
Square.prototype.create = function () {
  this.ele = document.createElement("div"); // 创建Element
  this.ele.className = this.className; // 设置className
  // 设置位置
  this.ele.style.left = this.x + "px";
  this.ele.style.top = this.y + "px";
  box.appendChild(this.ele); // 放入box
}
#### 三、Snake构造函数
##### 1.创建Snake构造函数，用于存储蛇身相关信息
function Snake() {
  this.head = null; // 蛇头
  this.tail = null; // 蛇尾
  this.eyes = []; // 眼睛
  this.bodyPos = []; // 身体所占位置
  this.nextPos = []; // 蛇头下一个点
  direction = {}; // 方向信息
  this.dirSet = { // 方向信息集合
    up: {
      x: 0, // left
      y: -10, // top
      leClass: "eyes leftEyeUp", // 左眼class
      reClass: "eyes rightEyeUp" // 右眼class
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
##### 2.在Snake的原型上创建init方法，用处初始化蛇身数据
Snake.prototype.init = function () {
  // 创建蛇身
  var snakeBody = []; // 蛇身数组
  for (var i = 0; i < 5; i++) {
    snakeBody[i] = new Square([270, 250 + i * 10], "snake"); // 实例化
    this.bodyPos.push([270, 250 + i * 10]); // 更新蛇身所占位置
    snakeBody[i].create(); // 创建蛇身元素并插入box
  }
  this.head = snakeBody[0]; // 更新蛇头信息
  this.tail = snakeBody[4]; // 更新蛇尾信息
  // 形成链表关系
  for (var i = 0; i < 5; i++) {
    snakeBody[i].last = snakeBody[i - 1]; // 当前蛇身的last为前一个蛇身
    snakeBody[i].next = snakeBody[i + 1]; // 当前蛇身的next为后一个蛇身
  }
  // 设置方向信息为上
  this.direction = this.dirSet.up;
  // 创建眼睛
  this.eyes[0] = document.createElement("i");
  this.eyes[1] = document.createElement("i");
  this.setEyesPos(); // 设置眼睛位置
  this.setEyes(); // 把眼睛放入蛇头
}
##### 3.在Snake的原型上创建setEyes方法，用于把眼睛放入蛇头
Snake.prototype.setEyes = function () {
  this.head.ele.appendChild(this.eyes[0]);
  this.head.ele.appendChild(this.eyes[1]);
}
##### 4.在Snake的原型上创建setEyesPos方法，用于改变眼睛class
Snake.prototype.setEyesPos = function () {
  this.eyes[0].className = this.direction.leClass;
  this.eyes[1].className = this.direction.reClass;
}
##### 5.在Snake的原型上创建isRepeat方法，用于判断是否与蛇身重复
Snake.prototype.isRepeat = function (pos) {
  var len = this.bodyPos.length;
  for (var i = 0; i < len; i++) {
    if (pos[0] === this.bodyPos[i][0] && pos[1] === this.bodyPos[i][1]) {
      return true;
    }
  }
  return false;
}
##### 6.在Snake的原型上创建getnextPos方法，用于获取蛇头下一个位置的坐标
Snake.prototype.getnextPos = function () {
  this.nextPos[0] = this.head.x + this.direction.x;
  this.nextPos[1] = this.head.y + this.direction.y;
}
##### 7.在Snake的原型上创建move方法，用于判断下一步的情况（吃到食物/正常移动/游戏结束）
Snake.prototype.move = function () {
  this.getnextPos(); // 获得蛇头下一个位置坐标
  if (this.isRepeat(this.nextPos) || this.nextPos[0] < 0 || this.nextPos[0] > 540 || this.nextPos[1] < 0 || this.nextPos[1] > 540) { // 撞到自己或撞墙
    this.method.over.call(this); // 游戏结束
  } else if (this.nextPos[0] === game.food.x && this.nextPos[1] === game.food.y) { // 吃到食物
    this.method.food.call(this); // 吃到食物
  } else {
    this.method.go.call(this); // 移动
  }
}
##### 8.在Snake的原型上创建对象method，用于存放被调用的方法（go:向前移动/food:吃到食物/over:游戏结束）
Snake.prototype.method = {
  // 向前走一格
  go: function () {
    // 把蛇尾移到蛇头前，并更新蛇尾坐标
    this.tail.x = this.nextPos[0];
    this.tail.y = this.nextPos[1];
    this.tail.ele.style.left = this.tail.x + "px";
    this.tail.ele.style.top = this.tail.y + "px";
    // 更新链表关系
    this.head.last = this.tail; // 旧蛇头.last为旧蛇尾
    this.tail.next = this.head; // 旧蛇尾.next为旧蛇头
    this.tail = this.tail.last; // 新蛇尾为旧蛇尾.last
    this.tail.next = null; // 新蛇尾.next为空
    this.head = this.head.last; // 新蛇头为旧蛇头.last
    this.head.last = null; // 新蛇头.last位空
    this.setEyes(); // 把眼睛放入新蛇头
    // 更新蛇身所占位置坐标
    this.bodyPos.pop(); // 把蛇身坐标数组的最后一个（旧蛇尾坐标）删除
    this.bodyPos.unshift([this.head.x, this.head.y]); // 把新蛇头坐标插入数组的最前方
  },
  // 吃食物
  food: function () {
    game.score++; // 分数加一
    game.setScore(); // 更新游戏上方分数
    game.changeFoodPos(); // 改变食物位置
    // 创建新蛇头
    var snakeHead = new Square(this.nextPos, "snake");
    snakeHead.create();
    // 更新链表关系
    this.head.last = snakeHead; // 旧蛇头.last为新蛇头
    snakeHead.next = this.head; // 新蛇头.next为旧蛇头
    snakeHead.last = null; // 新蛇头.last为空
    // 更新蛇头信息
    this.head = snakeHead;
    // 更新蛇身所占位置坐标
    this.bodyPos.unshift([this.head.x, this.head.y]);
    this.setEyes(); // 把眼睛放入新蛇头
  },
  // over
  over: function () {
    game.over();  // 游戏结束
  }
}
#### 四、Game构造函数
##### 1.创建Game构造函数，用于存储游戏相关信息
function Game() {
  this.timer = null; // 定时器
  this.score = 0; // 分数
  this.food = {}; // 食物
  this.key = true; // 是否可改变蛇前进方向
  this.state = "ready"; // 游戏状态（未开始：ready，进行中：start，暂停：pause）
}
##### 2.在Game的原型上创建init方法，用于初始化游戏数据
Game.prototype.init = function () {
  snake = new Snake(); // 实例化snake对象
  snake.init(); // 初始化snake
  this.createFood(); // 创建食物
  this.setScore(); // 设置分数
  this.start(); // 开始游戏
}
##### 3.在Game的原型上创建start方法，用于开始游戏
Game.prototype.start = function () {
  this.state = "start"; // 游戏状态设置为"start"
  continueBtn.style.display = "none"; // 隐藏继续游戏按钮
  // 启动定时器
  this.timer = setInterval(function () {
    snake.move(); // 蛇移动
    // 如果game.key为false则更新眼睛class
    if (!game.key) {
      snake.setEyesPos(); // 更新眼睛class
      game.key = true; // key设置为true
    }
  }, 200);
}
##### 4.在Game的原型上创建pause方法，用于暂停游戏
Game.prototype.pause = function () {
  this.state = "pause"; // 游戏状态改为"pause"
  clearInterval(this.timer); // 清除定时器
  continueBtn.style.display = "block"; // 显示继续游戏按钮
}
##### 5.在Game的原型上创建over方法，用于游戏结束处理
Game.prototype.over = function () {
  this.state = "ready"; // 游戏状态改为"ready"
  clearInterval(this.timer); // 清楚定时器
  overScore.innerText = "分数：" + this.score; // 设置最终分数
  score.innerText = ""; // 清除游戏上方分数
  over.style.display = "block"; // 显示游戏结束界面
  startBtn.style.display = "block"; // 显示开始游戏按钮
  box.innerHTML = ""; // 清除box中的蛇身和食物
}
##### 6.在Game的原型上创建setScore方法，用于设置分数
Game.prototype.setScore = function () {
  score.innerText = "分数：" + this.score; // 更新游戏上方分数
}
##### 7.在Game的原型上创建createFood方法，用于创建食物
Game.prototype.createFood = function () {
  this.getFoodPos(); // 获得食物坐标
  this.food = new Square([this.food.x, this.food.y], "food"); // 实例化food对象
  this.food.create(); // 创建食物元素并插入box
}
##### 8.在Game的原型上创建getFoodPos方法，用于获取食物坐标
Game.prototype.getFoodPos = function () {
  var pos = []; // 坐标数组
  // 随机一个不与蛇身重复且不超出游戏区的坐标
  do {
    pos[0] = Math.floor(Math.random() * 55) * 10;
    pos[1] = Math.floor(Math.random() * 55) * 10;
  } while (snake.isRepeat(pos));
  this.food.x = pos[0];
  this.food.y = pos[1];
}
##### 9.在Game的原型上创建changeFoodPos方法，用于更改食物位置
Game.prototype.changeFoodPos = function () {
  this.getFoodPos(); // 获得食物坐标
  // 设置食物位置
  this.food.ele.style.left = this.food.x + "px";
  this.food.ele.style.top = this.food.y + "px";
}
#### 五、事件
##### 1.获取DOM元素
var score = document.getElementsByClassName("score")[0];
var over = document.getElementsByClassName("over")[0];
var overScore = document.getElementsByClassName("overScore")[0];
##### 2.创建开始游戏方法startGame 
function startGame() {
  startBtn.style.display = "none"; // 隐藏开始游戏按钮
  over.style.display = "none"; // 隐藏"over"
  game = new Game(); // 实例化game对象
  game.init(); // 初始化game
}
##### 3.开始游戏按钮点击事件
var startBtn = document.getElementsByClassName("start")[0];
startBtn.onclick = function () {
  startGame(); // 开始游戏
}
##### 4.box点击事件
var box = document.getElementsByClassName("box")[0];
box.onclick = function () {
  // 如果游戏状态为"start"，则暂停游戏
  if (game.state === "start") {
    game.pause(); // 暂停游戏
  }
}
##### 5.继续游戏按钮点击事件
var continueBtn = document.getElementsByClassName("continue")[0];
continueBtn.onclick = function () {
  game.start(); // 开始游戏
}
##### 6.键盘事件
document.onkeydown = function (e) {
  if (e.which === 32) { // 空格
    if (!game || game.state === "ready") { // 如果游戏状态为"ready",则开始游戏
      startGame();
    } else if (game.state === "start") { // 如果游戏状态为"start",则暂停游戏
      game.pause();
    } else if (game.state === "pause") { // 如果游戏状态为"pause",则开始游戏
      game.start();
    }
  } else if (game.key) {
    // 根据按键设置方向信息,并把更新game.key
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
