import {
    World, ContactEquation
} from 'p2';
import store from '../../store';
import {
    CONTACT_MATERIAL_PLAYER_GROUND,
    computeBForRamp
} from '../../utils/physic';
import {
    setPhysicEngine
} from './actions';


const initPhysicEngine = () => {
    const physicWorld = new World({
        gravity: [0, 9.82]
    });
    physicWorld.solver.iterations = 1;
    physicWorld.addContactMaterial(CONTACT_MATERIAL_PLAYER_GROUND);
    ContactEquation.prototype.computeB = computeBForRamp; // change computeB to block player on ramp

    store.dispatch(setPhysicEngine(physicWorld));
};

export default initPhysicEngine;
