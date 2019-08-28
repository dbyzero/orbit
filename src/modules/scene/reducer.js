const gameSceneReducer = (state = {
    changeCliffOver: null,
    sceneId: null
}, action) => {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'LOAD_SCENE':
            return Object.assign({}, newState, {
                sceneId: action.sceneId
            });
        case 'CHANGE_CLIFF_OVER':
            return Object.assign({}, newState, {
                changeCliffOver: action.value
            });
        default:
            break;
    }
    return newState;
};

export default gameSceneReducer;
