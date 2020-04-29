// Libs
import React, { useState, useEffect } from 'react';
import store from '../../store';

// Components
import loadSpritesheet from '../../utils/loadSpritesheet';

// Actions
import {
    moveCamera,
    zoomCamera
} from '../gameCamera/actions';
import {
    toggleDebugMode
} from './actions';
import {
    setPlayer,
    addPhysicalItem
} from '../gameScene/actions';

// Engines
import { initPhysicEngine, loadLevelPhysic, updatePhysicEngine } from './physicEngine';
import {
    initGraphicEngine,
    loadLevelGraphic,
    updateGraphicEngine,
    showTest
} from './graphicEngine';

// Model
import Player from '../gameScene/player';
import PhysicalItem from '../gameScene/physicalItem';

// vars used in engines
let leftButtonPushed = false;
let rightButtonPushed = false;

const initLevel = level => loadSpritesheet({
    name: level,
    jsonFile: require(`../../levels/${level}/spritesheet.json`),// eslint-disable-line
    pngFile: `/levels/${level}/spritesheet.png`
}).then(() => {
    const levelInformation = require(`../../levels/${level}/level.json`);// eslint-disable-line
    loadLevelPhysic(levelInformation);
    loadLevelGraphic(levelInformation);
    showTest();
});

const initPlayer = () => {
    const state = store.getState();
    const player = new Player({
        x: 950,
        y: 100,
        mass: 10,
        width: 14,
        height: 25
    });
    store.dispatch(setPlayer(player));
    state.gameEngine.physicEngine.on('postStep', () => {
        if (rightButtonPushed) {
            player.setVelocity(20);
        }
        if (leftButtonPushed) {
            player.setVelocity(-20);
        }
    });
};

// Handle device event
const handlePointerMove = e => {
    const state = store.getState();
    if (state.gameEngine.debugModeActive === true) {
        store.dispatch(moveCamera(e.movementX, e.movementY));
    }
};
const handleKeyDown = e => {
    const state = store.getState();
    if (e.key === 'Control') {
        store.dispatch(toggleDebugMode());
    }
    if (e.key === 'ArrowLeft') {
        leftButtonPushed = true;
    }
    if (e.key === 'ArrowRight') {
        rightButtonPushed = true;
    }
    if (e.key === 'ArrowUp') {
        state.gameScene.player.jump();
    }
    if (e.key === 'r') {
        store.dispatch(zoomCamera(1));
    }
    if (e.key === 'x') {
        const physicalItem = new PhysicalItem({
            x: 950,
            y: 100,
            mass: 1,
            radius: 32
        });
        store.dispatch(addPhysicalItem(physicalItem));
    }
};
const handleKeyUp = e => {
    const state = store.getState();
    if (e.key === 'ArrowLeft') {
        state.gameScene.player.setVelocity(0);
        leftButtonPushed = false;
    }
    if (e.key === 'ArrowRight') {
        state.gameScene.player.setVelocity(0);
        rightButtonPushed = false;
    }
};
const handleMouseWheel = e => {
    const state = store.getState();
    if (e.deltaY > 0) {
        store.dispatch(zoomCamera(Math.max(0.5, state.gameCamera.zoom - 0.1)));
    } else {
        store.dispatch(zoomCamera(Math.min(4, state.gameCamera.zoom + 0.1)));
    }
    e.stopPropagation();
};
const handleResize = () => {
    const state = store.getState();
    state.gameEngine.graphicEngine.renderer.resize(window.innerWidth, window.innerHeight);
    state.gameEngine.graphicEngine.view.style.width = `${window.innerWidth}px`;
    state.gameEngine.graphicEngine.view.style.height = `${window.innerHeighth}px`;
};

// Initialisation script, a promise!
const init = level => new Promise(resolv => {
    window.addEventListener('pointermove', handlePointerMove, false);
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);
    window.addEventListener('wheel', handleMouseWheel, false);
    window.addEventListener('resize', handleResize, false);

    initPhysicEngine();
    initGraphicEngine();

    return loadSpritesheet({
        name: 'game',
        jsonFile: require('../../levels/game.json'), // eslint-disable-line
        pngFile: '/levels/game.png'
    })
        .then(() => initLevel(level))
        .then(() => initPlayer())
        .then(() => resolv());
});

// Game loop function
const gameLoopFunction = dt => {
    updateGraphicEngine();
};

// Start game loop fn
const start = () => {
    const state = store.getState();
    state.gameEngine.graphicEngine.ticker.add(gameLoopFunction);
    setInterval(() => {
        updatePhysicEngine(16.6);
    }, 16.6);
};

const GameEngine = props => {
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        setStatus(`initializing ${props.level}`);
        init(props.level).then(() => {
            setStatus('ready');
            start();
        });
    }, [props.level]);

    return (
        <div id="ViewPort" className={status} />
    );
};

export default GameEngine;
