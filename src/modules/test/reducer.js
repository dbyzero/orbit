const initialState = () => ({
    testVar: null
});

export default (state = initialState(), action) => {
    const newState = Object.assign({}, state);
    switch (action.type) {
        case 'TEST_ACTION':
            newState.testVar = '1';
            break;
        case 'TEST_ACTION_2':
            newState.testVar = '2';
            break;
        default:
            return state;
    }
    return newState;
};
