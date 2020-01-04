// Libs
import React, { useState, useEffect } from 'react';
import {
    Box, Body
} from 'p2';
import * as PIXI from 'pixi.js';
import store from '../../store';

// Components
import loadTextures from './loadTextures';
import {
    COLLISION_GROUP_PLAYER,
    COLLISION_GROUP_ENEMY,
    COLLISION_GROUP_GROUND,
    COLLISION_GROUP_RAMP,
    PLAYER_MATERIAL
} from '../../utils/physic';
import {
    moveCamera,
    zoomCamera,
    setCameraPosition
} from '../gameCamera/actions';
import {
    toggleDebugLayer
} from './actions';
import initPhysicEngine from './physicEngine';
import initGraphicEngine from './graphicEngine';

// vars used in engines
let debugButtonPushed = false;
let leftButtonPushed = false;
let rightButtonPushed = false;
let newCameraX = 0;
let newCameraY = 0;
const FPS_WANTED = 60;


/**
 * ******************************
 *         START TEST           *
 ********************************/
const player = new Body({
    mass: 10,
    position: [330, 100],
    velocity: [0, 0],
    fixedRotation: true
});
const playerSprite = PIXI.Sprite.from(PIXI.Texture.WHITE);

const initTestComponent = () => {
    const state = store.getState();

    state.gameEngine.physicEngine.on('postStep', () => {
        if (!debugButtonPushed) {
            if (rightButtonPushed) {
                player.velocity[0] = 10;
            }
            if (leftButtonPushed) {
                player.velocity[0] = -10;
            }
        }
    });
    const playerShape = new Box({
        width: 10,
        height: 10,
        boundingRadius: 10,
        collisionGroup: COLLISION_GROUP_PLAYER,
        collisionMask: COLLISION_GROUP_ENEMY | COLLISION_GROUP_GROUND | COLLISION_GROUP_RAMP,
        material: PLAYER_MATERIAL
    });
    player.addShape(playerShape);
    state.gameEngine.physicEngine.addBody(player);

    playerSprite.x = player.position[0];
    playerSprite.y = player.position[1] - playerSprite.height / 2;
    playerSprite.width = player.shapes[0].width;
    playerSprite.height = player.shapes[0].height;
    state.gameEngine.graphicEngine.stage.addChild(playerSprite);
};
/**
 * ****************************
 *         END TEST           *
 ******************************/

// Handle device event
const handlePointerMove = e => {
    if (debugButtonPushed) {
        store.dispatch(moveCamera(e.movementX, e.movementY));
    }
};
const handleKeyDown = e => {
    if (e.key === 'Control') {
        debugButtonPushed = !debugButtonPushed;
        store.dispatch(toggleDebugLayer());
    }
    if (e.key === 'ArrowLeft') {
        leftButtonPushed = true;
    }
    if (e.key === 'ArrowRight') {
        rightButtonPushed = true;
    }
    if (e.key === 'ArrowUp') {
        player.velocity[1] = -50;
    }
    if (e.key === 'r') {
        store.dispatch(zoomCamera(1));
    }
};
const handleKeyUp = e => {
    if (e.key === 'ArrowLeft') {
        player.velocity[0] = 0;
        leftButtonPushed = false;
    }
    if (e.key === 'ArrowRight') {
        player.velocity[0] = 0;
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

// Game loop function
const gameLoopFunction = dt => {
    const state = store.getState();
    if (!debugButtonPushed) {
        newCameraX = -player.position[0] * state.gameCamera.zoom + state.gameEngine.graphicEngine.view.width / 2;
        newCameraY = -player.position[1] * state.gameCamera.zoom + state.gameEngine.graphicEngine.view.height / 2;
        if (state.gameCamera.x !== newCameraX
            || state.gameCamera.y !== newCameraY
        ) {
            store.dispatch(setCameraPosition(newCameraX, newCameraY));
        }
    }

    playerSprite.x = player.position[0] - playerSprite.width / 2;
    playerSprite.y = player.position[1] - playerSprite.height / 2;

    state.gameEngine.graphicEngine.stage.x = state.gameCamera.x;
    state.gameEngine.graphicEngine.stage.y = state.gameCamera.y;
    state.gameEngine.graphicEngine.stage.scale.x = state.gameCamera.zoom;
    state.gameEngine.graphicEngine.stage.scale.y = state.gameCamera.zoom;

    // TODO :update game physic slower
    state.gameEngine.physicEngine.step(1 / FPS_WANTED, dt);
};

// Initialisation script, a promise!
const init = level => new Promise(resolvInitialisation => {
    window.addEventListener('pointermove', handlePointerMove, false);
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);
    window.addEventListener('wheel', handleMouseWheel, false);
    window.addEventListener('resize', handleResize, false);

    initPhysicEngine();
    initGraphicEngine();

    // initPhysicalEngine();
    // initGraphicEngine();

    // Load textures
    loadTextures().then(() => {
        const Level = require(`../../levels/${level}`); // eslint-disable-line
        const state = store.getState();
        Level.loadScene();

        // add WebGL canvas container to DOM
        document.getElementById('ViewPort').appendChild(state.gameEngine.graphicEngine.view);
        resolvInitialisation();
    });
});

// Start game loop fn
const start = () => {
    const state = store.getState();
    console.log('Here is physic world:', state.gameEngine.physicalEngine); // eslint-disable-line no-console

    initTestComponent();
    state.gameEngine.graphicEngine.ticker.add(gameLoopFunction);
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
