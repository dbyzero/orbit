const gameSceneReducer = (state = {
    totalDisplayShown: null,
    changeCliffOver: null
}, action) => {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'UPDATE_TOTAL_DISPLAY_SHOWN':
            return Object.assign({}, newState, {
                totalDisplayShown: action.value
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
