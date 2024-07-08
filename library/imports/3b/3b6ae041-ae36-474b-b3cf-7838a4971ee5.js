"use strict";
cc._RF.push(module, '3b6aeBBrjZHS7PPeDiklx7l', 'ArrowPlayer');
// scripts/arrow/ArrowPlayer.js

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
    bulletPrefab: {
      "default": null,
      type: cc.Prefab
    },
    skillBulletPrefab: {
      "default": null,
      type: cc.Prefab
    },
    scene: {
      "default": null,
      type: cc.Node
    },
    speed: 0,
    dir: cc.Vec2.RIGHT,
    faceDir: 1,
    idleAnim: '',
    runAnim: '',
    attackAnim: '',
    skillAnim: '',
    attackAudio: {
      "default": null,
      type: cc.AudioClip
    },
    vDown: 0,
    g: 1500,
    moveAble: true
  },
  skill: function skill() {
    if (this.skillAnim) {
      cc.audioEngine.playEffect(this.attackAudio, false);
      this.playAnimation(this.skillAnim, false);
      this.animationBlock = true;
    } else {
      this.attack();
    }
  },
  attack: function attack() {
    if (this.animationBlock) {
      return;
    }

    if (!this.nextAttackAnim) {
      this.nextAttackAnim = this.attackAnim;
    }

    this.animationBlock = true;
    cc.audioEngine.playEffect(this.attackAudio, false);
    this.playAnimation(this.nextAttackAnim, false);
  },
  run: function run() {
    if (!this.animationBlock && this.runAnim) {
      this.playAnimation(this.runAnim, true);
    }

    this.running = true;
  },
  idle: function idle() {
    if (!this.animationBlock && this.idleAnim) {
      this.playAnimation(this.idleAnim, true);
    }

    this.running = false;
  },
  die: function die() {
    var anim = this.node.getComponent(cc.Animation);
    anim.stop();
    this.game.onGameFailed();
  },
  setDir: function setDir(dir) {
    this.dir = dir.normalize();

    if (this.dir.x > 0) {
      this.faceDir = -1;
    } else if (this.dir.x < 0) {
      this.faceDir = 1;
    }

    this.node.runAction(cc.flipX(this.faceDir < 0));
    var ctx = this.getGraphics();
    ctx.clear();

    for (var i = 5; i < 30; i++) {
      var start = cc.v2(-this.faceDir * i * 20 * this.dir.x, -i * 20 * this.dir.y + 20);
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(start.x - this.faceDir * 10 * this.dir.x, start.y - 10 * this.dir.y);
    }

    ctx.stroke();
  },
  onLoad: function onLoad() {
    this.bloodLeft = this.blood;
    this.animationBlock = false;
    this.setDir(cc.v2(0, 0));
    this.idle();
    this.getComponent("LivingObject").die = this.die;
    this.node.x = -300;
  },
  onStart: function onStart() {},
  getGraphics: function getGraphics() {
    if (!this.ctx) {
      this.ctx = this.node.getChildByName("graphics").getComponent(cc.Graphics);
    }

    return this.ctx;
  },
  update: function update(dt) {
    this.node.y += this.vDown * dt;
    this.vDown -= this.g * dt;

    if (this.dir.mag() === 0 || !this.moveAble) {
      if (this.running) {
        this.idle();
      }

      return;
    }

    if (!this.running) {
      this.run();
    }

    var sceneDir = -this.faceDir;
    var xb = this.scene.width / 2;

    if (this.node.x < -10 && this.faceDir > 0 || this.node.x > 10 && this.faceDir < 0) {
      this.node.x += this.speed * this.faceDir * dt;
      return;
    }

    if (this.scene.x < xb && sceneDir > 0 || this.scene.x > -xb && sceneDir < 0) {
      this.scene.x += this.speed * sceneDir * dt;
      return;
    }

    if (this.node.x < 450 && this.faceDir > 0 || this.node.x > -450 && this.faceDir < 0) {
      this.node.x += this.speed * this.faceDir * dt;
      return;
    }
  },
  playAnimation: function playAnimation(animation, repeat) {
    var anim = this.node.getComponent(cc.Animation);
    anim.stop();
    var animState = anim.play(animation);

    if (repeat) {
      animState.wrapMode = cc.WrapMode.Normal;
      animState.wrapMode = cc.WrapMode.Loop;
      animState.repeatCount = Infinity;
    }
  },
  skillBullet: function skillBullet() {
    var newBullet = cc.instantiate(this.skillBulletPrefab);
    this.scene.addChild(newBullet, 1);
    var pos = this.node.getParent().convertToWorldSpaceAR(this.node.position);
    pos = this.scene.convertToNodeSpaceAR(pos);
    newBullet.position = pos;
    newBullet.getComponent('Bullet').dir = cc.v2(this.faceDir, 0);
    newBullet.getComponent('Bullet').owner = this;
  },
  shootBullet: function shootBullet(bullet, bulletPos) {
    if (!bullet) {
      bullet = this.bulletPrefab;
    }

    var newBullet = cc.instantiate(bullet);
    this.scene.addChild(newBullet, 1);
    var pos = this.node.getParent().convertToWorldSpaceAR(this.node.position);
    pos = this.scene.convertToNodeSpaceAR(pos);

    if (!bulletPos || bulletPos === "front") {
      pos.y += 20; //pos.x = pos.x + this.faceDir * this.node.width / 2;
    }

    newBullet.position = pos;
    newBullet.getComponent('Bullet').dir = this.dir.negSelf();
    newBullet.getComponent('Bullet').owner = this;
    newBullet.getComponent('Bullet').speed = 800;
    this.setDir(cc.v2(-this.faceDir, 0));
  },
  onAttackFinish: function onAttackFinish(nextAttackAnim) {
    this.animationBlock = false;

    if (nextAttackAnim) {
      this.nextAttackAnim = nextAttackAnim;
    } else {
      this.nextAttackAnim = this.attackAnim;
    }

    if (this.running) {
      this.run();
    } else {
      this.idle();
    }
  },
  onCollisionEnter: function onCollisionEnter(other, self) {
    if (other.node.group === 'scene') {
      var selfPos = self.node.getParent().convertToWorldSpaceAR(self.node.position);
      var otherPos = other.node.getParent().convertToWorldSpaceAR(other.node.position);
      otherPos = otherPos.add(other.offset);

      if (selfPos.x > otherPos.x + other.size.width / 2 || selfPos.x < otherPos.x - other.size.width / 2) {
        this.moveAble = false;
      } else if (selfPos.y < otherPos.y) {
        this.vDown = 0;
      } else {
        this.vDown = 0;
        this.g = 0;
      }
    }
  },
  onCollisionExit: function onCollisionExit(other, self) {
    if (other.node.group === 'scene') {
      this.g = 2000;
      this.moveAble = true;
    }
  }
});

cc._RF.pop();