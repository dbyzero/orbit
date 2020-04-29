export function setPlayer(player) {
    return {
        type: 'SET_PLAYER',
        payload: {
            player
        }
    };
}

export function addPhysicalItem(physicalItem) {
    return {
        type: 'ADD_PHYSICAL_ITEM',
        payload: physicalItem
    };
}
