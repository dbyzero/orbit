const initialState = () => ({
    showUI: true
});

export default (state = initialState(), action) => {
    const newState = Object.assign({}, state);
    switch (action.type) {
        case 'TOGGLE_UI_LAYER':
            newState.showUI = !newState.showUI;
            return newState;
        case 'HIDE_UI_LAYER':
            newState.showUI = false;
            return newState;
        case 'SHOW_UI_LAYER':
            newState.showUI = true;
            return newState;
        default:
            return state;
    }
};
