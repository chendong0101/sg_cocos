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
    extends: cc.Component,

    properties: {
        map: {
            default: [],
            type: Array,
        },
        wallPrefab: {
            default: null,
            type: cc.Prefab
        },
        monsterPrefab: {
            default: null,
            type: cc.Prefab
        },
        towerPrefab: {
            default: null,
            type: cc.Prefab
        },
        scene: {
            default: null,
            type: cc.Node
        },
        waveCD: 0,
        waveLable: {
            default: null,
            type: cc.Label
        },
        resultUIPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    onLoad () {
        this.monsters = new Array();
        this.walls = new Array();
        this.mapWidth = this.scene.width;
        this.mapHeight = this.scene.height;
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.cd = this.waveCD;
        this.wave = 0;
        this.map = [
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        for (var i = 0; i < 8; i ++) {
            for (var j = 0; j < 15; j++) {
                if (this.map[i][j] >= 1) {
                    var wall = cc.instantiate(this.wallPrefab);
                    this.scene.addChild(wall, 1);
                    wall.position = this.getGridPos(i, j);
                    this.walls.push(wall);
                }
                if (this.map[i][j] > 1) {
                    var tower  = cc.instantiate(this.towerPrefab);
                    this.scene.addChild(tower, 1);
                    tower.position = this.getGridPos(i, j);
                    tower.getComponent("Tower").game = this;
                    tower.getComponent("Tower").active = true;
                }
            }
        }

        this.node.walk((target) => {
            if (target.name === "bench") {
                var tower = cc.instantiate(this.towerPrefab);
                this.scene.addChild(tower, 1);
                tower.position = this.scene.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(target.position));
                tower.getComponent("Tower").game = this;
            }
            if (target.name === "obstacle") {
                target.getComponent("Obstacle").game = this;
            }
        }, 
        (target) => {});

        this.city = this.scene.getChildByName("city");
    },

    start () {

    },

    update (dt) {
        if (!this.city || !this.city.isValid) {
            this.onGameFailed();
            return;
        }
        if (this.wave > 2) {
            for (var i = 0; i < this.monsters.length; ++i) {
                if (this.monsters[i].isValid) {
                    return;
                }
            }
            this.onGameSuccess();
        }
        if (this.cd <= 0) {
            this.newWave();
            this.cd = this.waveCD;
        }
        this.cd -= dt;
        this.waveLable.string = '下一波进攻还有: ' + Math.floor(this.cd) + " 秒";
    },

    onGameSuccess () {
        var ui = cc.instantiate(this.resultUIPrefab);
        this.node.addChild(ui, 0);
    },

    onGameFailed () {
        var ui = cc.instantiate(this.resultUIPrefab);
        this.node.addChild(ui, 0);
        for (var i = 0; i < this.monsters.length; ++i) {
            if (this.monsters[i].isValid) {
                this.monsters[i].destroy();
            }
        }
    },

    newWave() {
        var path = [[0,0], [1,0], [2,0], [3,0], [4,0], [5,1], [5,2],[5,3],[5,4],[6,5],[7,6]
                ,[7,7],[7,8],[6,8],[5,8],[4,8],[3,9],[2,10],[2,11],[2,12],[3,1],[4,13],[5,14],[6,15],[6,16]];
        for (var i = 0; i < 5 + this.wave * 1.5; i++) {
            var monster = cc.instantiate(this.monsterPrefab);
            this.scene.addChild(monster, 1);
            monster.group = "enemy";
            monster.position = this.getGridPos(0, 0);
            monster.setContentSize(64, 64);
            monster.removeComponent("Killer");
            monster.addComponent("Runner");
            monster.getComponent("Runner").speed = 100 + this.wave * 10;
            monster.getComponent("Runner").sleep = i;
            monster.getComponent("Runner").game = this;
            monster.getComponent("Runner").updatePath();
            monster.getComponent("LivingObject").retreatLength = 0;
            monster.getComponent("LivingObject").blood += this.wave * 5;
            monster.getComponent("LivingObject").updateBloodBar();
            this.monsters.push(monster);
        }
        this.wave++;
    },

    updateMonsterPath() {
        for (var i = 0; i < this.monsters.length; ++i) {
            if (this.monsters[i].isValid) {
                this.monsters[i].getComponent("Runner").updatePath();
            }
        }
    },

    getGridPos(i, j) {
        return cc.v2(j * 64 - this.mapWidth / 2 + 32, this.mapHeight / 2 - i * 64 - 32);
    },

    getGridIndex(pos) {
        var j = (pos.x + this.mapWidth / 2) / 64 | 0;
        var i = (this.mapHeight / 2 - pos.y) / 64 | 0;
        return cc.v2(i, j);
    },
});
