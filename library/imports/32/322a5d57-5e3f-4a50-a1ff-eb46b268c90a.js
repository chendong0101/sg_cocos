"use strict";
cc._RF.push(module, '322a51XXj9KUKH/60ayaMkK', 'Game-Start-Btn');
// scripts/UI/Game-Start-Btn.js

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
  // onLoad () {},
  start: function start() {},
  onLoad: function onLoad() {// this.node.on('click', this.onStart, this);
  },
  onStart: function onStart(eventTouch) {
    console.log(eventTouch.target.name);

    if ("start2Btn" === eventTouch.target.name) {
      cc.director.loadScene("rpg-game");
    } else if ("start1Btn" === eventTouch.target.name) {
      cc.director.loadScene("arrow-game");
    } else if ("city" === eventTouch.target.name) {
      cc.director.loadScene("defense");
    }
  } // update (dt) {},

});

cc._RF.pop();