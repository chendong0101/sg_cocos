"use strict";
cc._RF.push(module, '05d3bQtOWdK7qzCapQC12pQ', 'Jump-Controller');
// scripts/rpg/controller/Jump-Controller.js

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
    cd: 0
  },
  doJump: function doJump() {
    if (this.jumpCD > 0) {
      return;
    }

    this.jumpCD = this.cd;

    this._getPlayer().doJump();
  },
  onLoad: function onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.doJump, this);
    this.jumpCD = this.cd;
  },
  start: function start() {},
  update: function update(dt) {
    if (this.jumpCD > 0) {
      this.jumpCD -= dt;
    }
  },
  _getPlayer: function _getPlayer() {
    return this.node.getComponent("Controller").player.getComponent("RPGPlayer");
  }
});

cc._RF.pop();