"use strict";
cc._RF.push(module, '05a87u35tpB/4AXksiIVkhr', 'Tower');
// scripts/defense/Tower.js

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
    faceDir: 1,
    skill_cd: 0,
    active: false,
    bulletPrefab: {
      "default": null,
      type: cc.Prefab
    },
    attackAudio: {
      "default": null,
      type: cc.AudioClip
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    var _this = this;

    // var anim = this.node.getComponent(cc.Animation);
    // var animState = anim.play();
    // animState.wrapMode = cc.WrapMode.Normal;
    // animState.wrapMode = cc.WrapMode.Loop;
    // animState.repeatCount = Infinity;
    this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
      if (_this.active) {
        return;
      }

      _this.opacity = 100;
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

      if (_this.game.map[i][j] === 1) {
        _this.node.position = _this.game.getGridPos(i, j);
        _this.game.map[i][j] = 2;

        _this.onActive();
      } else {
        _this.node.position = cc.v2(_this.originPos);
        cc.log("origin pos: " + _this.originPos);
      }
    }, this.node);
  },
  onActive: function onActive() {
    this.active = true;
  },
  start: function start() {
    this.originPos = cc.v2(this.node.position);
  },
  update: function update(dt) {
    if (!this.active) {
      return;
    }

    if (this.cd > 0) {
      this.cd -= dt;
    }

    this.scanEnemy();
  },
  scanEnemy: function scanEnemy() {
    var _this2 = this;

    if (!this.game) {
      cc.log("game is null");
      return;
    }

    this.game.monsters.forEach(function (enemy) {
      if (!enemy.isValid) {
        return;
      }

      var pos = _this2.node.position;
      var enemyPos = enemy.position;

      if (pos.sub(enemyPos).mag() < _this2.vision) {
        _this2.doAttack(enemy);
      }
    });
  },
  doAttack: function doAttack(target) {
    if (!this.bulletPrefab) {
      return;
    }

    if (this.cd > 0) {
      return;
    }

    if (this.attackAudio) {
      cc.audioEngine.playEffect(this.attackAudio, false);
    }

    this.cd = this.skill_cd;
    var newBullet = cc.instantiate(this.bulletPrefab);
    newBullet.group = 'player';
    this.node.getParent().addChild(newBullet, 1);
    var pos = cc.v2(this.node.position.x, this.node.position.y);
    pos.x = pos.x + this.faceDir * this.node.width / 2;
    newBullet.position = pos;
    newBullet.getComponent('Bullet').dir = target.position.sub(this.node.position).normalizeSelf();
    newBullet.getComponent('Bullet').owner = this;
  }
});

cc._RF.pop();