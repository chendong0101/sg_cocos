"use strict";
cc._RF.push(module, 'b8f93c6uNhOu5ZQPv0PwEtU', 'Move-Controller');
// scripts/rpg/controller/Move-Controller.js

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
  onTouchMove: function onTouchMove(eventTouch) {
    var w_pos = eventTouch.getLocation();
    var pos = this.node.convertToNodeSpaceAR(w_pos);
    var len = pos.mag();

    if (len > this.disc_r) {
      pos.x = this.disc_r * pos.x / len;
      pos.y = this.disc_r * pos.y / len;
    }

    this.stick.setPosition(pos);

    this._getPlayer().setDir(pos);
  },
  onTouchEnd: function onTouchEnd(eventTouch) {
    this.stick.setPosition(cc.v2(0, 0));

    this._getPlayer().setDir(cc.v2(0, 0));
  },
  onLoad: function onLoad() {
    this.disc = this.node.getChildByName("disc");
    this.stick = this.node.getChildByName("stick");
    this.disc_r = this.disc.width / 2;
    this.disc.on(cc.Node.EventType.TOUCH_START, this.onTouchMove, this);
    this.disc.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.disc.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.disc.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  },
  start: function start() {},
  // update (dt) {},
  _getPlayer: function _getPlayer() {
    return this.node.getComponent("Controller").player.getComponent("RPGPlayer");
  }
});

cc._RF.pop();