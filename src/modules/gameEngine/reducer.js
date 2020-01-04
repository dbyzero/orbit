const initialState = {
    physicEngine: null,
    graphicEngine: null,
    debugLayer: null
};

export default (state = initialState, action) => {
    const newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_PHYSIC_ENGINE':
            newState.physicEngine = action.payload.physicEngine;
            return newState;
        case 'SET_GRAPHIC_ENGINE':
            newState.graphicEngine = action.payload.graphicEngine;
            return newState;
        case 'SET_DEBUG_LAYER':
            newState.debugLayer = action.payload.debugLayer;
            return newState;
        case 'TOGGLE_DEBUG_LAYER':
            newState.debugLayer.visible = !newState.debugLayer.visible;
            return newState;
        case 'LOGOUT':
            return initialState;
        default:
            return state;
    }
};
