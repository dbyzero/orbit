const loaderReducer = (state = {
    showOverlay: false,
    isActive: false,
    message: ''
}, action) => {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'HIDE_OVERLAY':
            return Object.assign({}, newState, {
                showOverlay: false
            });
        case 'SHOW_OVERLAY':
            return Object.assign({}, newState, {
                showOverlay: true
            });
        default:
            break;
    }
    return newState;
};

export default loaderReducer;
