import React from 'react';

const GameEngineContext = React.createContext({
    camera: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight
    }
});

export default GameEngineContext;
