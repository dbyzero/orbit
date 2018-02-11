import React from 'react';
import GameUI from './GameUI.jsx';
import GameScene from './GameScene.jsx';

class Game extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="game">
                <GameUI/>
                <GameScene/>
            </div>
        );
    }
}

export default Game;
