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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, event => {
            if (this.active) {
                return;
            }
            this.opacity = 50;
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
            cc.log("result: " + j + "\t" + i);
            if (this.game.map[i][j] === 0) {
                cc.log("result: " + j + "\t" + i);
                this.node.position = this.game.getGridPos(i, j);
                this.game.map[i][j] = 1;
                this.game.updateMonsterPath();
                this.active = true;
            } else {
                this.node.position = cc.v2(this.originPos);
                cc.log("origin pos: " + this.originPos);
            }
        }, this.node);
    },

    start () {
        this.originPos = cc.v2(this.node.position);
    },

    // update (dt) {},
});
