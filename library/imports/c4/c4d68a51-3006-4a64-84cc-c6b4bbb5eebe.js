"use strict";
cc._RF.push(module, 'c4d68pRMAZKZITMxrS7te6+', 'Arrow-Controller');
// scripts/arrow/controller/Arrow-Controller.js

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
    skill_cd: 0
  },
  // LIFE-CYCLE CALLBACKS:
  shoot: function shoot() {
    if (this.cd > 0) {
      return;
    }

    this.cd = this.skill_cd;

    this._getPlayer().attack();
  },
  onLoad: function onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.shoot, this);
  },
  start: function start() {},
  update: function update(dt) {
    if (this.cd > 0) {
      this.cd -= dt;
    }
  },
  _getPlayer: function _getPlayer() {
    return this.node.getComponent("Controller").player.getComponent("ArrowPlayer");
  }
});

cc._RF.pop();