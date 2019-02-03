const cameraReducer = (state = {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    zoom: 1
}, action) => {
    let newState = Object.assign({}, state);
    let newZoom,
        deltaWidth,
        deltaHeight;
    switch (action.type) {
        case 'MOVE_CAMERA':
            return Object.assign({}, newState, {
                x: state.x + action.value.dx/state.zoom,
                y: state.y + action.value.dy/state.zoom
            });
        case 'ZOOM_CAMERA':
            if (action.value.dz < 1) {
                newZoom = Math.max(1/8, newState.zoom * 0.9);
            } else {
                newZoom = Math.min(4, newState.zoom * 1.1);
            }
            deltaWidth = state.width / state.zoom - state.width / newZoom;
            deltaHeight = state.height / state.zoom - state.height / newZoom;
            return Object.assign({}, newState, {
                zoom: newZoom,
                x: state.x - deltaWidth / 2,
                y: state.y - deltaHeight / 2
            });
        case 'CAMERA_RESIZE':
            return Object.assign({}, newState, {
                width: action.value.width,
                height: action.value.height
            });
        default:
            break;
    }
    return newState;
};

export default cameraReducer;
