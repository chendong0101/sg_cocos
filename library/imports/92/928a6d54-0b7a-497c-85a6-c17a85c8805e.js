"use strict";
cc._RF.push(module, '928a61UC3pJfIWmwXqFyIBe', 'Star');
// scripts/rpg/Star.js

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
    g: 1500,
    vDown: 0
  },
  onPicked: function onPicked() {
    this.game.addScore(2);
    this.node.destroy();
  },
  onCollisionEnter: function onCollisionEnter(other, self) {
    if (other.node.group === 'scene') {
      this.onPicked();
    }
  },
  update: function update(dt) {
    this.node.y += this.vDown * dt;
    this.vDown -= this.g * dt;
  },
  start: function start() {} // update (dt) {},

});

cc._RF.pop();