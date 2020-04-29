import {
    Body, Circle
} from 'p2';
import {
    COLLISION_GROUP_PLAYER,
    COLLISION_GROUP_ENEMY,
    COLLISION_GROUP_GROUND,
    COLLISION_GROUP_RAMP,
    GROUND_MATERIAL
} from '../../utils/physic';
import store from '../../store';

import { createAnimation } from '../../utils/graphic';

class PhysicalItem {
    physicObject = null;
    graphicObject = null;
    zIndex = 150;
    radius = 32;

    constructor(params) {
        const state = store.getState();
        this.physicObject = new Body({
            mass: params.mass,
            position: [params.x, params.y],
            velocity: [0, 0]
        });
        const shape = new Circle({
            radius: params.radius,
            collisionGroup: COLLISION_GROUP_ENEMY,
            collisionMask: COLLISION_GROUP_PLAYER | COLLISION_GROUP_ENEMY | COLLISION_GROUP_GROUND | COLLISION_GROUP_RAMP,
            material: GROUND_MATERIAL
        });
        this.physicObject.addShape(shape);

        this.radius = params.radius;

        this.graphicObject = createAnimation('rollingrock', 1, 0.2);
        this.graphicObject.zIndex = this.zIndex;
        this.graphicObject.pivot.x = this.radius;
        this.graphicObject.pivot.y = this.radius;

        state.gameEngine.physicEngine.addBody(this.physicObject);
        state.gameEngine.graphicEngine.stage.addChild(this.graphicObject);
    }
}

PhysicalItem.prototype.update = function () {
    // adapt position following physic
    this.graphicObject.x = this.physicObject.position[0];
    this.graphicObject.y = this.physicObject.position[1];
    this.graphicObject.rotation = this.physicObject.angle;
};

export default PhysicalItem;
