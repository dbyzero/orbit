import {
    World, ContactEquation, Box, Convex, Plane, Body
} from 'p2';
import store from '../../store';
import {
    COLLISION_GROUP_PLAYER,
    COLLISION_GROUP_GROUND,
    COLLISION_GROUP_ENEMY,
    COLLISION_GROUP_RAMP,
    GROUND_MATERIAL,
    CONTACT_MATERIAL_PLAYER_GROUND,
    computeBForRamp
} from '../../utils/physic';
import {
    setPhysicEngine
} from './actions';

const FPS_WANTED = 60;

export function initPhysicEngine() {
    const physicWorld = new World({
        gravity: [0, 9.82]
    });
    physicWorld.solver.iterations = 1;
    // physicWorld.addContactMaterial(CONTACT_MATERIAL_PLAYER_GROUND);
    ContactEquation.prototype.computeB = computeBForRamp; // change computeB to block player on ramp

    store.dispatch(setPhysicEngine(physicWorld));
}

export function loadLevelPhysic(levelJson) {
    const state = store.getState();
    const { physicEngine } = state.gameEngine;

    // add plane
    const ceil = new Body();
    ceil.addShape(new Plane({
        collisionGroup: COLLISION_GROUP_GROUND
    }));
    physicEngine.addBody(ceil);

    const floor = new Body({
        position: [0, levelJson.height],
        angle: Math.PI
    });
    floor.addShape(new Plane({
        collisionGroup: COLLISION_GROUP_GROUND
    }));
    physicEngine.addBody(floor);

    const left = new Body({
        position: [0, 0],
        angle: 3 * Math.PI / 2
    });
    left.addShape(new Plane({
        collisionGroup: COLLISION_GROUP_GROUND
    }));
    physicEngine.addBody(left);

    const right = new Body({
        position: [levelJson.width, 0],
        angle: Math.PI / 2
    });
    right.addShape(new Plane({
        collisionGroup: COLLISION_GROUP_GROUND
    }));
    physicEngine.addBody(right);

    levelJson.collisionItems.forEach(item => {
        // debug view
        let body;
        let shape;
        switch (item.type) {
            case 'rectangle':
                body = new Body({
                    position: [item.x, item.y],
                    mass: 0,
                    type: Body.STATIC
                });

                shape = new Box({
                    width: item.width,
                    height: item.height,
                    collisionGroup: COLLISION_GROUP_GROUND,
                    collisionMask: COLLISION_GROUP_PLAYER | COLLISION_GROUP_ENEMY,
                    material: GROUND_MATERIAL
                });

                body.addShape(shape);
                physicEngine.addBody(body);
                break;
            case 'polygone':
                body = new Body({
                    position: [item.x, item.y],
                    mass: 0,
                    type: Body.STATIC
                });

                shape = new Convex({
                    vertices: item.vertices,
                    collisionGroup: COLLISION_GROUP_RAMP,
                    collisionMask: COLLISION_GROUP_PLAYER | COLLISION_GROUP_ENEMY,
                    material: GROUND_MATERIAL
                });

                body.addShape(shape);
                physicEngine.addBody(body);
                break;
            default:
                throw new Error('Unknow collision type');
        }
    });
}

export function updatePhysicEngine(dt) {
    const state = store.getState();
    state.gameEngine.physicEngine.step(1 / FPS_WANTED, dt);
}
