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

    // onLoad () {},

    start () {

    },

    onLoad: function () {
        // this.node.on('click', this.onStart, this);
    },

    onStart(eventTouch) {
        console.log(eventTouch.target.name);
        if ("start2Btn" === eventTouch.target.name) {
            cc.director.loadScene("rpg-game");
        } else if ("start1Btn" === eventTouch.target.name) {
            cc.director.loadScene("arrow-game");
        } else if ("city" === eventTouch.target.name) {
            cc.director.loadScene("defense");
        }
    },

    // update (dt) {},
});
