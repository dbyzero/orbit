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

class Player {
    physicObject = null;
    graphicObject = null;
    jumpSpeed = -50;

    constructor(param) {
        const state = store.getState();
        this.physicObject = new Body({
            mass: param.mass,
            position: [param.x, param.y],
            velocity: [0, 0],
            fixedRotation: true
        });
        const playerShape = new Box({
            width: param.width,
            height: param.height,
            boundingRadius: 10,
            collisionGroup: COLLISION_GROUP_PLAYER,
            collisionMask: COLLISION_GROUP_ENEMY | COLLISION_GROUP_GROUND | COLLISION_GROUP_RAMP,
            material: PLAYER_MATERIAL
        });
        this.physicObject.addShape(playerShape);

        // graphic
        this.graphicObject = PIXI.Sprite.from(PIXI.Texture.WHITE);
        this.graphicObject.x = this.physicObject.position[0];
        this.graphicObject.y = this.physicObject.position[1] - this.graphicObject.height / 2;
        this.graphicObject.width = this.physicObject.shapes[0].width;
        this.graphicObject.height = this.physicObject.shapes[0].height;
        this.graphicObject.zIndex = 100;

        state.gameEngine.physicEngine.addBody(this.physicObject);
        state.gameEngine.graphicEngine.stage.addChild(this.graphicObject);
    }
    // animation
    // const animations = {
    //     stand: null,
    //     run: null,
    //     melee1: null,
    //     melee2: null,
    //     melee3: null,
    //     meleeAir1: null,
    //     meleeAir2: null,
    //     range: null,
    //     cast: null,
    //     castLoop: null,
    //     die: null,
    //     jumpUp: null,
    //     jumpDown: null,
    //     useItem: null,
    //     swordOn: null,
    //     swordOff: null
    // };

    // let current_animation = null;
    // let current_hp = null;
    // let maximum_hp = null;
    // let currentFeeling = null;
}

Player.prototype.setVelocity = function (x, y) {
    if (x) {
        this.physicObject.velocity[0] = x;
    }
    if (y) {
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
    this.graphicObject.x = this.physicObject.position[0]
        - this.graphicObject.width / 2;
    this.graphicObject.y = this.physicObject.position[1]
        - this.graphicObject.height / 2;
};

export default Player;
