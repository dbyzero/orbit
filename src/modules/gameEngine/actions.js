export function setGraphicEngine(graphicEngine) {
    return {
        type: 'SET_GRAPHIC_ENGINE',
        payload: {
            graphicEngine
        }
    };
}

export function setPhysicEngine(physicEngine) {
    return {
        type: 'SET_PHYSIC_ENGINE',
        payload: {
            physicEngine
        }
    };
}

export function setDebugLayer(debugLayer) {
    return {
        type: 'SET_DEBUG_LAYER',
        payload: {
            debugLayer
        }
    };
}

export function toggleDebugLayer() {
    return {
        type: 'TOGGLE_DEBUG_LAYER',
        payload: {}
    };
}
