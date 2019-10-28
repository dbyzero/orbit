const initialState = () => ({
    showMenu: false
});

export default (state = initialState(), action) => {
    const newState = Object.assign({}, state);
    switch (action.type) {
        case 'TOGGLE_MENU_LAYER':
            newState.showMenu = !newState.showMenu;
            return newState;
        case 'SHOW_MENU_LAYER':
            newState.showMenu = true;
            return newState;
        case 'HIDE_MENU_LAYER':
            newState.showMenu = false;
            return newState;
        default:
            return state;
    }
};
