"use strict";
cc._RF.push(module, '42fa6g4VuxAM4vCnY81GmeE', 'Runner');
// scripts/defense/Runner.js

"use strict";

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: {
    path: {
      "default": null,
      type: Array
    },
    nextPoint: 0,
    speed: 0,
    sleep: 1,
    endPoint: cc.v2(7, 17)
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {
    var anim = this.node.getComponent(cc.Animation);
    var animState = anim.play();
    animState.wrapMode = cc.WrapMode.Normal;
    animState.wrapMode = cc.WrapMode.Loop;
    animState.repeatCount = Infinity;
  },
  update: function update(dt) {
    if (this.sleep > 0) {
      this.sleep -= dt;
      return;
    }

    if (!this.path) {
      return;
    }

    if (this.nextPoint >= this.path.length) {
      return;
    }

    var i = this.path[this.nextPoint][0];
    var j = this.path[this.nextPoint][1];
    var aimPos = this.game.getGridPos(i, j);

    if (this.node.position.sub(aimPos).mag() < 10) {
      this.nextPoint++;
      return;
    }

    var dir = aimPos.sub(this.node.position).normalizeSelf();
    this.node.x += dir.x * this.speed * dt;
    this.node.y += dir.y * this.speed * dt;
  },
  die: function die() {
    this.node.destroy();
  },
  updatePath: function updatePath() {
    var travelled = new Array();
    var startIndex = this.game.getGridIndex(this.node.position);
    var queue = new Queue();
    queue.push(new Element(startIndex, 0, 0, null));
    travelled.push(startIndex);
    var endEle = null;

    while (!queue.isEmpty()) {
      var ele = queue.pop();

      if (ele.index.x === this.endPoint.x && ele.index.y === this.endPoint.y) {
        endEle = ele;
        break;
      }

      for (var i = -1; i <= 1; ++i) {
        for (var j = -1; j <= 1; ++j) {
          if (i * i + j * j === 2) {
            continue;
          }

          var distance = cc.v2(i, j).mag() + ele.distance;
          var index = cc.v2(ele.index.x + i, ele.index.y + j);

          if (index.x < 0 || index.x > 7 || index.y < 0 || index.y > 17) {
            continue;
          }

          if (this.game.map[index.x][index.y] != 0) {
            continue;
          }

          var hasTravelled = false;

          for (var t = 0; t < travelled.length; t++) {
            if (travelled[t].x === index.x && travelled[t].y === index.y) {
              hasTravelled = true;
              break;
            }
          }

          if (!hasTravelled) {
            queue.push(new Element(index, this.endPoint.sub(index).mag() + distance, distance, ele));
            travelled.push(index);
          }
        }
      }
    }

    if (endEle) {
      var path = new Array();

      while (endEle) {
        var point = new Array();
        point.push(endEle.index.x);
        point.push(endEle.index.y);
        path.unshift(point);
        endEle = endEle.parent;
      }

      this.path = path;
      this.nextPoint = 0;
    }
  }
});

function Element(index, estimate, distance, parent) {
  this.index = index;
  this.estimate = estimate;
  this.distance = distance;
  this.parent = parent;
}

function Queue() {
  this.data = [];

  this.push = function (element) {
    this.data.push(element);
  };

  this.pop = function () {
    var priority = 0;

    for (var i = 0; i < this.data.length; ++i) {
      if (this.data[i].distance < this.data[priority].distance) {
        priority = i;
      }
    }

    var ele = this.data[priority];
    this.data.splice(priority, 1);
    return ele;
  };

  this.isEmpty = function () {
    return this.data.length === 0;
  };

  this.toString = function () {
    var retstr = '';

    for (var i = 0; i < this.data.length; ++i) {
      retstr += this.data[i].index + " distance: " + this.data[i].distance + "\n";
    }

    return retstr;
  };
}

;

cc._RF.pop();