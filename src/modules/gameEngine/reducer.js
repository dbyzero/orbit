const initialState = () => (
    {
        x: 0,
        y: 0,
        initialWidth: window.innerWidth,
        initialHeight: window.innerHeight,
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: 1
    }
);

export default (state = initialState(), action) => {
    const newState = Object.assign({}, state);
    switch (action.type) {
        case 'MOVE_CAMERA':
            newState.x = newState.x + action.payload.dX;
            newState.y = newState.y + action.payload.dY;
            console.log(newState);
            return newState;
        case 'CAMERA_RESIZE':
            newState.initialWidth = action.payload.width;
            newState.initialHeight = action.payload.height;
            console.log(newState);
            return newState;
        case 'ZOOM_CAMERA':
            newState.zoom = action.payload.dZ;
            return newState;
        case 'LOGOUT':
            return initialState;
        default:
            return state;
    }
};
