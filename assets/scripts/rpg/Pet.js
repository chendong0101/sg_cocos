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
        speed: 0,
        followLength: 0,
        dir: cc.v2(0, 0),
        faceDir: -1,
        mountPoint: cc.v2(-50, 50),
        yRange: cc.v2(0, 0),
        player: {
            default: null,
            type: cc.Node
        },
        inTask: false,
        taskStar: {
            default: null,
            type: cc.Node
        },
    },

    onLoad () {
        this.originFaceDir = this.faceDir;
        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.play();
        animState.wrapMode = cc.WrapMode.Normal;
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
    },

    onCollisionEnter (other, self) {
        if (other.node.name === 'star') {
            other.node.getComponent("Star").onPicked();
        }
        this.inTask = false;
    },

    setDir(dir) {
        this.dir = dir;
        if (this.dir.x > 0) {
            this.faceDir = 1;
        } else if (this.dir.x < 0) {
            this.faceDir = -1;
        } else {
            this.faceDir = this.player.getComponent("RPGPlayer").faceDir;
        }
        this.node.runAction(cc.flipX((this.originFaceDir * this.faceDir) < 0));
    },
    
    followOwner() {
        if (this.inTask) {
            return;
        }
        if (this.player != null) {
            var pos = this.node.getParent().convertToWorldSpaceAR(this.node.position);
            var playerPos = this.player.getParent().convertToWorldSpaceAR(this.player.position);
            var realMountPoint = cc.v2(this.mountPoint);
            if (this.player.getComponent("RPGPlayer").faceDir < 0) {
                realMountPoint.x = -this.mountPoint.x;
            }
             //cc.log(this.player.getComponent("RPGPlayer").faceDir);
             //cc.log(this.mountPoint.x);
             //cc.log(realMountPoint.x);
            playerPos = realMountPoint.add(playerPos);
            if (pos.sub(playerPos).mag() > this.followLength) {
                playerPos = this.node.getParent().convertToNodeSpaceAR(playerPos);
                var dir = playerPos.sub(this.node.position);
                this.setDir(dir);
            } else {
                this.setDir(cc.v2(0, 0));
            }
        }
    },

    scanStar() {
        if (this.inTask && this.taskStar.isValid) {
            return;
        }
        this.inTask = false;
        var star = this.scene.getChildByName("star");
        if (!star) {
            return;
        }
        var pos = this.node.getParent().convertToWorldSpaceAR(this.node.position);
        var starPos = star.getParent().convertToWorldSpaceAR(star.position);
        if (pos.sub(starPos).mag() < this.vision) {
            this.onStarInView(star);
        }
    },

    onStarInView(star) {
        var pos = this.node.getParent().convertToWorldSpaceAR(this.node.position);
        var starPos = star.getParent().convertToWorldSpaceAR(star.position);
        var dir = cc.v2(0, 0);
        if (pos.sub(starPos).mag() > 0) {
            starPos = this.node.getParent().convertToNodeSpaceAR(starPos);
            dir = starPos.sub(this.node.position);
        }
        this.setDir(dir);
        this.inTask = true;
        this.taskStar = star;
    },

    start () {
        if (!this.player) {
            this.player = this.game.player;
        }
        if (!this.scene) {
            this.scene = this.game.scene;
        }
    },

    update (dt) {
        this.scanStar();
        this.followOwner();
        if (this.dir.mag() === 0) {
            return;
        }

        var len = this.dir.mag();
        this.node.x += this.dir.x / len * this.speed * dt;
        this.node.y += this.dir.y / len * this.speed * dt;
        if (this.node.y < this.yRange.x) {
            this.node.y = this.yRange.x;
        } else if (this.node.y > this.yRange.y) {
            this.node.y = this.yRange.y;
        }
    },

});
