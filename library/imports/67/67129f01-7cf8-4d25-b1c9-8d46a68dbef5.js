"use strict";
cc._RF.push(module, '671298BfPhNJbHJjUamjb71', 'ArrowGame');
// scripts/arrow/ArrowGame.js

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
    starPrefab: {
      "default": null,
      type: cc.Prefab
    },
    batPrefab: {
      "default": null,
      type: cc.Prefab
    },
    snowmanPrefab: {
      "default": null,
      type: cc.Prefab
    },
    groundHeight: 0,
    scene: {
      "default": null,
      type: cc.Node
    },
    playerPrefab: {
      "default": null,
      type: cc.Prefab
    },
    controllerPrefab: {
      "default": null,
      type: cc.Prefab
    },
    scoreDisplay: {
      "default": null,
      type: cc.Label
    },
    scoreAudio: {
      "default": null,
      type: cc.AudioClip
    },
    successUIPrefab: {
      "default": null,
      type: cc.Prefab
    },
    failedUIPrefab: {
      "default": null,
      type: cc.Prefab
    },
    totalTime: 0
  },
  onLoad: function onLoad() {
    this.gameStatus = 'playing';
    this.monsterCount = 0;
    var userDataStr = cc.sys.localStorage.getItem("data");
    cc.log(userDataStr);

    if (!userDataStr) {
      this.userData = {
        coin: 0,
        level: 0
      };
      cc.log(this.userData);
    } else {
      this.userData = JSON.parse(userDataStr);
    }

    var manager = cc.director.getCollisionManager();
    manager.enabled = true;
    manager.enabledDebugDraw = true;
    manager.enabledDrawBoundingBox = true;
    this.score = 0;
    var children = this.scene.children;

    for (var i = 0; i < children.length; ++i) {
      if (children[i].getComponent("LivingObject")) {
        children[i].getComponent("LivingObject").game = this;
      }
    }

    this.initScoreDisplayLable();
    this.initPlayer();
    this.initController();
  },
  initScoreDisplayLable: function initScoreDisplayLable() {// this.scoreDisplay = cc.instantiate(this.scorePrefab);
    // this.node.addChild(this.scoreDisplay, 2);
  },
  initPlayer: function initPlayer() {
    this.player = cc.instantiate(this.playerPrefab);
    this.node.addChild(this.player, 1);
    this.player.name = "player";
    this.player.getComponent("ArrowPlayer").scene = this.scene;
    this.player.getComponent("ArrowPlayer").game = this;
    this.player.getComponent("LivingObject").game = this;
  },
  initController: function initController() {
    this.controller = cc.instantiate(this.controllerPrefab);
    this.node.addChild(this.controller, 2);
    var children = this.controller.children;

    for (var i = 0; i < children.length; ++i) {
      if (children[i].getComponent("Controller")) {
        children[i].getComponent("Controller").player = this.player;
      }
    }
  },
  spawnNewMonster: function spawnNewMonster(pos, prefab) {
    var newMonster = cc.instantiate(prefab);
    newMonster.getComponent('LivingObject').game = this;
    this.node.addChild(newMonster, 1);
    newMonster.setPosition(pos);
    this.monsterCount++;
  },
  spawnNewStar: function spawnNewStar(pos, count) {
    this.monsterCount--;
    var step = 2 * Math.PI / count;

    for (var i = 0; i < count; i++) {
      var newStar = cc.instantiate(this.starPrefab);
      this.scene.addChild(newStar, 1);
      var starPos = cc.v2(pos.x + 90 * Math.sin(i * step), pos.y + 90 * Math.cos(i * step));
      newStar.setPosition(starPos);
      newStar.getComponent('Star').game = this;
      newStar.getComponent('Star').vDown = 300;
    }
  },
  addScore: function addScore(i) {
    if (this.score === 100) {
      return;
    }

    this.score = i + this.score;
    this.scoreDisplay.string = '金币: ' + this.score;
    cc.audioEngine.playEffect(this.scoreAudio, false);
  },
  onGameEnd: function onGameEnd() {
    this.gameStatus = 'end';
    this.player.destroy();
    this.scoreDisplay.destroy();
    cc.log(this.userData);
    this.userData.coin += this.score;
    cc.sys.localStorage.setItem("data", JSON.stringify(this.userData));
    var userDataStr = cc.sys.localStorage.getItem("data");
    cc.log("data in storage: " + userDataStr);
  },
  onGameSuccess: function onGameSuccess() {
    var ui = cc.instantiate(this.successUIPrefab);
    this.node.addChild(ui, 0);
    this.userData.level++;
    this.onGameEnd();
  },
  onGameFailed: function onGameFailed() {
    var ui = cc.instantiate(this.failedUIPrefab);
    this.node.addChild(ui, 0);
    this.onGameEnd();
  },
  onGameStart: function onGameStart() {
    cc.director.loadScene('game');
    this.player.onStart();
  },
  update: function update(dt) {
    this.totalTime += dt;

    if (this.totalTime < 0.1) {
      for (var i = 0; i < 0; i++) {
        var pos = cc.v2(Math.random() * 500, 220);
        this.spawnNewMonster(pos, this.batPrefab);
      }

      for (var i = 0; i < 1; i++) {
        var pos = cc.v2(Math.random() * 500, -180);
        this.spawnNewMonster(pos, this.snowmanPrefab);
      }
    }

    if (this.monsterCount === 0 && this.gameStatus === 'playing') {
      this.onGameSuccess();
    }
  }
});

cc._RF.pop();