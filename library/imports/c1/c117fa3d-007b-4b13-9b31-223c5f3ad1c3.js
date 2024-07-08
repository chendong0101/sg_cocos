"use strict";
cc._RF.push(module, 'c117fo9AHtLE5sxIjxfOtHD', 'Obstacle');
// scripts/defense/Obstacle.js

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
  properties: {},
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    var _this = this;

    this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
      if (_this.active) {
        return;
      }

      _this.opacity = 50;
      var delta = event.touch.getDelta();
      _this.node.x += delta.x;
      _this.node.y += delta.y;
    }, this.node);
    this.node.on(cc.Node.EventType.TOUCH_END, function () {
      if (_this.active) {
        return;
      }

      _this.opacity = 255;

      var index = _this.game.getGridIndex(_this.node.position);

      var i = index.x;
      var j = index.y;
      cc.log("result: " + j + "\t" + i);

      if (_this.game.map[i][j] === 0) {
        cc.log("result: " + j + "\t" + i);
        _this.node.position = _this.game.getGridPos(i, j);
        _this.game.map[i][j] = 1;

        _this.game.updateMonsterPath();

        _this.active = true;
      } else {
        _this.node.position = cc.v2(_this.originPos);
        cc.log("origin pos: " + _this.originPos);
      }
    }, this.node);
  },
  start: function start() {
    this.originPos = cc.v2(this.node.position);
  } // update (dt) {},

});

cc._RF.pop();