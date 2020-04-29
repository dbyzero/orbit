import {
    Box, Body
} from 'p2';
import {
    COLLISION_GROUP_PLAYER,
    COLLISION_GROUP_ENEMY,
    COLLISION_GROUP_GROUND,
    COLLISION_GROUP_RAMP,
    PLAYER_MATERIAL
} from '../../utils/physic';
import store from '../../store';

import { createAnimation } from '../../utils/graphic';

class Player {
    physicObject = null;
    graphicObject = null;
    jumpSpeed = -50;
    zIndex = 100;
    width = 0;
    height = 0;
    animations = {};
    isFlying = true;
    isAttacking = false;
    current_animation = 'stand';
    current_orientation = 'left';
    previous_animation = 'stand';
    previous_orientation = 'right';

    constructor(params) {
        const state = store.getState();
        this.physicObject = new Body({
            mass: params.mass,
            position: [params.x, params.y],
            velocity: [0, 0],
            fixedRotation: true
        });
        const playerShape = new Box({
            width: params.width,
            height: params.height,
            boundingRadius: 10,
            collisionGroup: COLLISION_GROUP_PLAYER,
            collisionMask: COLLISION_GROUP_ENEMY | COLLISION_GROUP_GROUND | COLLISION_GROUP_RAMP,
            material: PLAYER_MATERIAL
        });
        this.physicObject.addShape(playerShape);

        this.width = params.width;
        this.height = params.height;

        // this.animations.stand = createAnimation('adventurer-idle', 2, 0.08);
        this.animations.stand = createAnimation('adventurer-idle-2', 4, 0.2);
        this.animations.run = createAnimation('adventurer-run3', 6, 0.15);
        this.animations.jumpUp = createAnimation('adventurer-crnr-jmp', 2, 0.15);
        this.animations.jumpDown = createAnimation('adventurer-fall', 2, 0.15);

        this.animations.attack1 = createAnimation('adventurer-attack1', 5, 0.30);
        this.animations.attack2 = createAnimation('adventurer-attack2', 6, 0.30);
        this.animations.attackRun = createAnimation('adventurer-attack3', 6, 0.30);

        this.animations.meleeAir1 = null;
        this.animations.meleeAir2 = null;
        this.animations.range = null;
        this.animations.cast = null;
        this.animations.castLoop = null;
        this.animations.die = null;
        this.animations.useItem = null;
        this.animations.swordOn = null;
        this.animations.swordOff = null;

        this.graphicObject = createAnimation('adventurer-idle-2', 4, 0.2);
        this.graphicObject.zIndex = this.zIndex;
        this.graphicObject.pivot.x = 25;
        this.graphicObject.pivot.y = 23;

        state.gameEngine.physicEngine.addBody(this.physicObject);
        state.gameEngine.graphicEngine.stage.addChild(this.graphicObject);
    }
}

Player.prototype.setVelocity = function (x, y) {
    if (x !== undefined) {
        this.physicObject.velocity[0] = x;
        switch (true) {
            case x > 0:
                this.current_orientation = 'right';
                break;
            case x < 0:
                this.current_orientation = 'left';
                break;
            default:
        }
    }
    if (y !== undefined) {
        this.physicObject.velocity[1] = y;
    }
};

Player.prototype.setPosition = function (x, y) {
    this.physicObject.position = [x, y];
};

Player.prototype.move = function (x, y) {
    this.physicObject.position = [
        this.physicObject.position.x + x,
        this.physicObject.position.y + y
    ];
};

Player.prototype.jump = function () {
    this.physicObject.velocity[1] = this.jumpSpeed;
};

Player.prototype.update = function () {
    // turn on orientation changed
    if (this.current_orientation !== this.previous_orientation) {
        if (this.current_orientation === 'left') {
            this.graphicObject.scale.x = -1;
        } else {
            this.graphicObject.scale.x = 1;
        }
    }

    // check if landing
    if (this.isFlying && Math.abs(this.physicObject.velocity[1]) < 0.2) {
        this.isFlying = false;
    }
    if (!this.isFlying && Math.abs(this.physicObject.velocity[1]) > 14) {
        this.isFlying = true;
    }

    // adapt position following physic
    this.graphicObject.x = this.physicObject.position[0];
    this.graphicObject.y = this.physicObject.position[1];

    this.updateAnimation();

    // store data for next tick update
    this.previous_animation = this.current_animation;
    this.previous_orientation = this.current_orientation;
};

Player.prototype.getCurrentAnimation = function () {
    if (this.isFlying) {
        if (this.physicObject.velocity[1] > 0) {
            return 'jumpDown';
        }
        return 'jumpUp';
    }
    if (Math.abs(this.physicObject.velocity[0]) > 0.2) {
        return 'run';
    }
    return 'stand';
};

Player.prototype.updateAnimation = function () {
    this.current_animation = this.getCurrentAnimation();
    if (this.previous_animation !== this.current_animation) {
        this.graphicObject.textures = this.animations[this.current_animation].textures;
        this.graphicObject.animationSpeed = this.animations[this.current_animation].animationSpeed;
        this.graphicObject.play();
    }
};

export default Player;
