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
        vision: 0,
        faceDir: 1,
        skill_cd: 0,
        active: false,
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        attackAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // var anim = this.node.getComponent(cc.Animation);
        // var animState = anim.play();
        // animState.wrapMode = cc.WrapMode.Normal;
        // animState.wrapMode = cc.WrapMode.Loop;
        // animState.repeatCount = Infinity;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, event => {
            if (this.active) {
                return;
            }
            this.opacity = 100;
            var delta = event.touch.getDelta();
            this.node.x += delta.x;
            this.node.y += delta.y;
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.active) {
                return;
            }
            this.opacity = 255;
            var index = this.game.getGridIndex(this.node.position);
            var i = index.x;
            var j = index.y;
            if (this.game.map[i][j] === 1) {
                this.node.position = this.game.getGridPos(i, j);
                this.game.map[i][j] = 2;
                this.onActive();
            } else {
                this.node.position = cc.v2(this.originPos);
                cc.log("origin pos: " + this.originPos);
            }
        }, this.node);
    },

    onActive () {
        this.active = true;
    },

    start () {
        this.originPos = cc.v2(this.node.position);
    },

    update (dt) {
        if (!this.active) {
            return;
        }
        if (this.cd > 0) {
            this.cd -= dt;
        }
        this.scanEnemy();
    },

    scanEnemy() {
        if (!this.game) {
            cc.log("game is null");
            return;
        }
        this.game.monsters.forEach(enemy => {
            if (!enemy.isValid) {
                return;
            }
            var pos = this.node.position;
            var enemyPos = enemy.position;
            if (pos.sub(enemyPos).mag() < this.vision) {
                this.doAttack(enemy);
            }
        });
    },

    doAttack(target) {
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
    },
});
