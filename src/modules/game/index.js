import React from 'react';
import GameUI from './components/UI.jsx';
import GameScene from './components/Scene.jsx';

import './style.scss';

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
