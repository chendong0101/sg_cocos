"use strict";
cc._RF.push(module, '35592F7UH1Dabqqvr1poSHF', 'RPGGame');
// scripts/rpg/RPGGame.js

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
    monsterPrefab: {
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
    petPrefab: {
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
    resultUIPrefab: {
      "default": null,
      type: cc.Prefab
    },
    totalTime: 0
  },
  onLoad: function onLoad() {
    var manager = cc.director.getCollisionManager();
    manager.enabled = true; //manager.enabledDebugDraw = true;
    //manager.enabledDrawBoundingBox = true;

    this.score = 0;
    var children = this.scene.children;

    for (var i = 0; i < children.length; ++i) {
      if (children[i].getComponent("LivingObject")) {
        children[i].getComponent("LivingObject").game = this;
      }
    }

    this.initScoreDisplayLable();
    this.initPlayer();
    this.initPet();
    this.initController();
  },
  initScoreDisplayLable: function initScoreDisplayLable() {// this.scoreDisplay = cc.instantiate(this.scorePrefab);
    // this.node.addChild(this.scoreDisplay, 2);
  },
  initPlayer: function initPlayer() {
    this.player = cc.instantiate(this.playerPrefab);
    this.node.addChild(this.player, 1);
    this.player.name = "player";
    this.player.getComponent("RPGPlayer").scene = this.scene;
    this.player.getComponent("RPGPlayer").game = this;
    this.player.getComponent("LivingObject").game = this;
  },
  initPet: function initPet() {
    this.pet = cc.instantiate(this.petPrefab);
    this.scene.addChild(this.pet, 1);
    var mountPoint = this.pet.getComponent("Pet").mountPoint;
    var pos = this.player.getParent().convertToWorldSpaceAR(this.player.position);
    pos = pos.add(mountPoint);
    this.pet.position = this.scene.convertToNodeSpaceAR(pos);
    this.pet.getComponent("Pet").scene = this.scene;
    this.pet.getComponent("Pet").player = this.player;
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
  spawnNewMonster: function spawnNewMonster() {
    var newMonster = cc.instantiate(this.monsterPrefab);
    newMonster.getComponent('LivingObject').game = this;
    this.scene.addChild(newMonster, 1);
    var pos = this.getNewMonsterPosition();
    newMonster.setPosition(pos);
  },
  spawnNewStar: function spawnNewStar(pos, count) {
    var step = 2 * Math.PI / count;

    for (var i = 0; i < count; i++) {
      var newStar = cc.instantiate(this.starPrefab);
      this.scene.addChild(newStar, 1);
      var starPos = cc.v2(pos.x + 90 * Math.sin(i * step), pos.y + 90 * Math.cos(i * step));
      newStar.setPosition(starPos);
      newStar.getComponent('Star').game = this;
    }
  },
  addScore: function addScore(i) {
    if (this.score === 100) {
      return;
    }

    this.score = i + this.score;
    this.scoreDisplay.string = 'Score: ' + this.score;
    cc.audioEngine.playEffect(this.scoreAudio, false);

    if (this.score === 100) {
      this.onGameSuccess();
    }
  },
  getNewMonsterPosition: function getNewMonsterPosition() {
    var randX = 0;
    var randY = this.groundHeight + Math.random() * 0.6 * this.player.getComponent('RPGPlayer').jumpHeight + 100;
    var maxX = this.scene.width / 2 - 20;
    randX = (Math.random() - 0.5) * 2 * maxX;
    return cc.v2(randX, randY);
  },
  onLivingObjectDead: function onLivingObjectDead(isBoss) {
    if (isBoss) {
      this.onGameSuccess();
    }
  },
  onGameEnd: function onGameEnd() {
    this.player.destroy();
    this.scoreDisplay.destroy();
  },
  onGameSuccess: function onGameSuccess() {
    this.onGameEnd();
    var ui = cc.instantiate(this.resultUIPrefab);
    this.node.addChild(ui, 0);
  },
  onGameFailed: function onGameFailed() {
    this.onGameEnd();
    var ui = cc.instantiate(this.resultUIPrefab);
    this.node.addChild(ui, 0);
  },
  onGameStart: function onGameStart() {
    cc.director.loadScene('game');
    this.player.onStart();
  } //    update (dt) {
  //        if (this.totalTime < 0) {
  //            this.onGameEnd();
  //            return;
  //        }
  //        this.totalTime -= dt;
  //    },

});

cc._RF.pop();