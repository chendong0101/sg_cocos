"use strict";
cc._RF.push(module, '166bfn9Hj9NyIeTJqPqi6LL', 'CP-Result');
// scripts/UI/CP-Result.js

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
  onOKClicked: function onOKClicked(eventTouch) {
    console.log(eventTouch.target.name);
    cc.director.loadScene("main");
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.node.getChildByName('ui-background').on('touchstart', function (event) {
      console.log('on click');
    }, this);
  },
  start: function start() {} // update (dt) {},

});

cc._RF.pop();