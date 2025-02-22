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
        g: 1500,
        vDown: 0,
    },

    onPicked: function() {
        this.game.addScore(2);
        this.node.destroy();
    },

    onCollisionEnter (other, self) {
        if (other.node.group === 'scene') {
            this.onPicked();
        }
    },

    update: function (dt) {
        this.node.y += this.vDown * dt;
        this.vDown -= this.g * dt;
    },

    start () {

    },

    // update (dt) {},
});
