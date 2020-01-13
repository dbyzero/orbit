import {
    Box, Body
} from 'p2';
import * as PIXI from 'pixi.js';
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
    current_animation = 'stand';
    current_orientation = 'left';
    previous_animation = 'stand';

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

        this.animations.stand = createAnimation('adventurer-idle-2', 4, 0.2);
        this.animations.run = createAnimation('adventurer-run', 6, 0.15);
        this.animations.fall = createAnimation('adventurer-fall', 2, 0.15);

        this.animations.melee1 = null;
        this.animations.melee2 = null;
        this.animations.melee3 = null;
        this.animations.meleeAir1 = null;
        this.animations.meleeAir2 = null;
        this.animations.range = null;
        this.animations.cast = null;
        this.animations.castLoop = null;
        this.animations.die = null;
        this.animations.jumpUp = null;
        this.animations.jumpDown = null;
        this.animations.useItem = null;
        this.animations.swordOn = null;
        this.animations.swordOff = null;

        this.graphicObject = createAnimation('adventurer-idle-2', 4, 0.2);
        this.graphicObject.zIndex = 100;
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
                this.current_animation = 'run';
                this.current_orientation = 'right';
                break;
            case x < 0:
                this.current_animation = 'run';
                this.current_orientation = 'left';
                break;
            default:
                this.current_animation = 'stand';
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
    this.physicObject.velocity[1] = -50;
};

Player.prototype.render = function () {
    if (this.current_orientation === 'left') {
        this.graphicObject.scale.x = -1;
    } else {
        this.graphicObject.scale.x = 1;
    }
    this.graphicObject.x = this.physicObject.position[0];
    this.graphicObject.y = this.physicObject.position[1];

    this.updateAnimation();
    this.previous_animation = this.current_animation;
};

Player.prototype.updateAnimation = function () {
    if (this.previous_animation !== this.current_animation) {
        this.graphicObject.textures = this.animations[this.current_animation].textures;
        this.graphicObject.animationSpeed = this.animations[this.current_animation].animationSpeed;
        this.graphicObject.play();
    }
}

export default Player;
