// import {
//     Box, Body
// } from 'p2';
// import * as PIXI from 'pixi.js';
// import {
//     COLLISION_GROUP_PLAYER,
//     COLLISION_GROUP_ENEMY,
//     COLLISION_GROUP_GROUND,
//     COLLISION_GROUP_RAMP,
//     PLAYER_MATERIAL
// } from '../../utils/physic';
import store from '../../store';

class Level {
    name = null;
    constructor(param) {
        this.name = param.name;
    }
}

Level.prototype.initLevel = function () {
    const state = store.getState();
    const { graphicEngine, physicEngine } = state.gameEngine;

    const collisionsItems = require(`../../levels/${this.name}/collisionItems.json`); // eslint-disable-line
    
};

Level.prototype.renderLevel = function () {
};

export default Level;
