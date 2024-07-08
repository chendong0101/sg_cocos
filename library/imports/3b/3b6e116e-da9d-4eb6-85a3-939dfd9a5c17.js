"use strict";
cc._RF.push(module, '3b6e1Fu2p1OtoWjk539mlwX', 'Killer');
// scripts/enemy/Killer.js

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
    vision: 0,
    speed: 0,
    attackLength: 0,
    dir: cc.v2(0, 0),
    faceDir: 1,
    yRange: cc.v2(0, 0),
    skill_cd: 0,
    player: {
      "default": null,
      type: cc.Node
    },
    bulletPrefab: {
      "default": null,
      type: cc.Prefab
    }
  },
  onLoad: function onLoad() {
    var anim = this.node.getComponent(cc.Animation);
    var animState = anim.play();
    animState.wrapMode = cc.WrapMode.Normal;
    animState.wrapMode = cc.WrapMode.Loop;
    animState.repeatCount = Infinity;
    this.game = this.node.getComponent("LivingObject").game;
    this.curFaceDir = this.faceDir;
  },
  onEnemyInView: function onEnemyInView(enemy) {
    var pos = this.node.getParent().convertToWorldSpaceAR(this.node.position);
    var enemyPos = enemy.getParent().convertToWorldSpaceAR(enemy.position);
    var dir = cc.v2(0, 0);

    if (pos.sub(enemyPos).mag() < this.attackLength) {
      this.doAttack(enemy);
    } else {
      enemyPos = this.node.getParent().convertToNodeSpaceAR(enemyPos);
      dir = enemyPos.sub(this.node.position);
    }

    this.setDir(dir);
  },
  onEnemyOutView: function onEnemyOutView() {
    this.setDir(cc.v2(0, 0));
    this.node.getComponent("LivingObject").init();
  },
  setDir: function setDir(dir) {
    this.dir = dir;

    if (this.dir.x > 0) {
      this.curFaceDir = 1;
    } else if (this.dir.x < 0) {
      this.curFaceDir = -1;
    }

    this.node.runAction(cc.flipX(this.curFaceDir * this.faceDir < 0));
  },
  scanPlayer: function scanPlayer() {
    if (this.player != null && cc.isValid(this.player)) {
      var pos = this.node.getParent().convertToWorldSpaceAR(this.node.position);
      var playerPos = this.player.getParent().convertToWorldSpaceAR(this.player.position);

      if (pos.sub(playerPos).mag() < this.vision) {
        this.onEnemyInView(this.player);
      } else {
        this.onEnemyOutView();
      }
    }
  },
  doAttack: function doAttack(target) {
    if (!this.bulletPrefab) {
      return;
    }

    if (this.cd > 0) {
      return;
    }

    this.cd = this.skill_cd;
    var newBullet = cc.instantiate(this.bulletPrefab);
    newBullet.group = 'enemy';
    this.node.getParent().addChild(newBullet, 1);
    var pos = cc.v2(this.node.position.x, this.node.position.y);
    pos.x = pos.x + this.curFaceDir * this.node.width / 2;
    newBullet.position = pos;
    newBullet.getComponent('Bullet').dir = cc.v2(this.faceDir, 0);
    newBullet.getComponent('Bullet').owner = this;
  },
  start: function start() {
    if (!this.player) {
      this.player = this.game.player;
    }
  },
  update: function update(dt) {
    if (this.cd > 0) {
      this.cd -= dt;
    }

    this.scanPlayer();

    if (this.dir.mag() === 0) {
      return;
    }

    var len = this.dir.mag();
    this.node.x += this.dir.x / len * this.speed * dt;
    this.node.y += this.dir.y / len * this.speed * dt;

    if (this.node.y < this.yRange.x) {
      this.node.y = this.yRange.x;
    } else if (this.node.y > this.yRange.y) {
      this.node.y = this.yRange.y;
    }
  }
});

cc._RF.pop();