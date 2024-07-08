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
        lifeTime: 0,
        speed: 0,
        stop: false,
        dir: cc.Vec2.RIGHT,
        power: 0,
        bomb_anim: "",
        g: 1500,
    },

    // onLoad () {},

    onBomb() {
        if (!this.bomb_anim || this.bomb_anim.length === 0) {
            this.onBombFinish();
        } else {
            var anim = this.node.getComponent(cc.Animation);
            var animState = anim.play(this.bomb_anim);
            animState.wrapMode = cc.WrapMode.Normal;
        }
    },

    onBombFinish() {
        this.node.destroy();
    },

    onCollisionEnter (other, self) {
        this.onBomb();
        if (other.getComponent("LivingObject")) {
            other.getComponent('LivingObject').onBeAttacked(this.node, this.owner);
        }
    },

    start () {
        this.v = cc.v2(this.speed * this.dir.x, this.speed * this.dir.y);
    },

    update (dt) {
        this.lifeTime -= dt;
        if (this.stop) {
            return;
        }
        var acos = Math.acos(this.v.x / this.v.mag());
        if (this.v.y < 0) {
            acos = 2 * Math.PI - acos;
        }
        this.node.angle = acos * 180 / Math.PI;
        if (this.lifeTime < 0) {
            this.onBomb();
            this.stop = true;
            return;
        }
        this.v.y -= this.g * dt;
        this.node.x += this.v.x * dt;
        this.node.y += this.v.y * dt;
    },
});
