const initialState = {
    player: null,
    monsters: {},
    players: {},
    projectiles: {},
    items: {}
};

export default (state = initialState, action) => {
    const newState = Object.assign({}, state);
    switch (action.type) {
        case 'SET_PLAYER':
            newState.player = action.payload.player;
            return newState;
        case 'ADD_MONSTER':
            newState.monsters[action.payload.monster.id] = action.payload.monster;
            return newState;
        case 'REMOVE_MONSTER':
            delete newState.monsters[action.payload.monster.id];
            return newState;
        case 'ADD_PLAYER':
            newState.players[action.payload.player.id] = action.payload.player;
            return newState;
        case 'REMOVE_PLAYER':
            delete newState.players[action.payload.player.id];
            return newState;
        case 'ADD_PROJECTILE':
            newState.projectiles[action.payload.projectile.id] = action.payload.projectile;
            return newState;
        case 'REMOVE_PROJECTILE':
            delete newState.projectiles[action.payload.projectile.id];
            return newState;
        case 'ADD_ITEM':
            newState.items[action.payload.item.id] = action.payload.item;
            return newState;
        case 'REMOVE_ITEM':
            delete newState.items[action.payload.item.id];
            return newState;
        case 'LOGOUT':
            return initialState;
        default:
            return state;
    }
};
