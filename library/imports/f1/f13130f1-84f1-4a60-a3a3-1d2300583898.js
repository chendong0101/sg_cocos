"use strict";
cc._RF.push(module, 'f1313DxhPFKYKOjHSMAWDiY', 'LivingObject');
// scripts/LivingObject.js

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
    retreatLength: 0,
    beAttackedAudio: {
      "default": null,
      type: cc.AudioClip
    },
    starCount: 1,
    bloodBarPrefab: {
      "default": null,
      type: cc.Prefab
    },
    isBoss: false,
    blood: 0
  },
  // onCollisionEnter (other, self) {
  //     // console.log(other.node.name);
  // },
  onBeAttacked: function onBeAttacked(bullet, other) {
    if (this.retreatLength > 0) {
      var reTreatLength = this.retreatLength;
      var otherPos = other.node.getParent().convertToWorldSpaceAR(other.node.position);
      var thisPos = this.node.getParent().convertToWorldSpaceAR(this.node.position);

      if (otherPos.x - thisPos.x > 0) {
        reTreatLength = -this.retreatLength;
      }

      var retreat = cc.moveBy(0.1, cc.v2(reTreatLength, 0)).easing(cc.easeCubicActionOut());
      this.node.runAction(retreat); // cc.audioEngine.playEffect(this.beAttackedAudio, false);
    }

    this.updateBlood(-bullet.getComponent("Bullet").power);
  },
  die: function die() {
    this.node.destroy();

    if (this.game) {
      this.game.spawnNewStar(this.node.position, this.starCount);
      this.game.onLivingObjectDead(this.isBoss); //this.game.spawnNewMonster();
    }
  },
  updateBlood: function updateBlood(i) {
    this.bloodLeft += i;

    if (this.bloodLeft < 0) {
      this.bloodLeft = 0;
    }

    this.bloodBar.getChildByName("blood").width = this.bloodLeft * this.bloodBar.width / this.blood;

    if (this.bloodLeft === 0) {
      this.die();
    }
  },
  onLoad: function onLoad() {
    this.bloodBar = cc.instantiate(this.bloodBarPrefab);
    this.node.addChild(this.bloodBar, 0);
    this.updateBloodBar();
    this.init();
  },
  updateBloodBar: function updateBloodBar() {
    this.bloodBar.position = cc.v2(0, this.node.height / 2 + 10);
    var width = this.node.width;
    this.bloodBar.width = width;
    this.bloodBar.getChildByName("blood").width = width;
    this.bloodBar.getChildByName("blood").position = cc.v2(-width / 2, 0);
  },
  init: function init() {
    this.bloodLeft = this.blood;
  },
  start: function start() {} // update (dt) {},

});

cc._RF.pop();