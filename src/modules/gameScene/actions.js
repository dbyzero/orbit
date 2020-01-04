export function setPlayer(player) {
    return {
        type: 'SET_PLAYER',
        payload: {
            player
        }
    };
}
