// Libs
import React, { useState, useEffect } from 'react';
import {
    World, Box, Body, ContactEquation
} from 'p2';
import * as PIXI from 'pixi.js';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import store from '../../store';

// Components
import {
    COLLISION_GROUP_PLAYER,
    COLLISION_GROUP_ENEMY,
    COLLISION_GROUP_GROUND,
    COLLISION_GROUP_RAMP,
    PLAYER_MATERIAL,
    CONTACT_MATERIAL_PLAYER_GROUND,
    computeBForRamp
} from '../../utils/physic';
import loadTextures from './loadTextures';
import { moveCamera, zoomCamera, setCameraPosition } from './actions';

// used to track button state
let debugButtonPushed = false;
let leftButtonPushed = false;
let rightButtonPushed = false;

// Graphical stuff
const app = new PIXI.Application({
    backgroundColor: 0x333333,
    resolution: 1,
    antialias: false,
    forceFXAA: false,
    transparent: false
});
PIXI.loader = new PIXI.Loader();
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
app.renderer.autoResize = true;
app.stage.autoResize = true;
app.view.style.width = `${window.innerWidth}px`;
app.view.style.height = `${window.innerHeighth}px`;
let newCameraX;
let newCameraY;
const camera = {};

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
/**
 * ******************************
 *         END TEST           *
 ********************************/

// Physical stuff
const physicWorld = new World({
    gravity: [0, 9.82]
});
physicWorld.solver.iterations = 1;
physicWorld.addContactMaterial(CONTACT_MATERIAL_PLAYER_GROUND);
physicWorld.on('postStep', () => {
    if (!debugButtonPushed) {
        if (rightButtonPushed) {
            player.velocity[0] = 10;
        }
        if (leftButtonPushed) {
            player.velocity[0] = -10;
        }
    }
});
ContactEquation.prototype.computeB = computeBForRamp; // change computeB to block player on ramp
const collisionLayer = new PIXI.Graphics();
collisionLayer.visible = false;
collisionLayer.zIndex = 1000;
const FPS_WANTED = 60;

/**
 * ******************************
 *         START TEST           *
 ********************************/
const initTestComponent = () => {
    const playerShape = new Box({
        width: 10,
        height: 10,
        boundingRadius: 10,
        collisionGroup: COLLISION_GROUP_PLAYER,
        collisionMask: COLLISION_GROUP_ENEMY | COLLISION_GROUP_GROUND | COLLISION_GROUP_RAMP,
        material: PLAYER_MATERIAL
    });
    player.addShape(playerShape);
    physicWorld.addBody(player);

    playerSprite.x = player.position[0];
    playerSprite.y = player.position[1] - playerSprite.height / 2;
    playerSprite.width = player.shapes[0].width;
    playerSprite.height = player.shapes[0].height;
    app.stage.addChild(playerSprite);
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
        collisionLayer.visible = !collisionLayer.visible;
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
    if (e.deltaY > 0) {
        store.dispatch(zoomCamera(Math.max(0.5, camera.zoom - 0.1)));
    } else {
        store.dispatch(zoomCamera(Math.min(4, camera.zoom + 0.1)));
    }
    e.stopPropagation();
};
const handleResize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.view.style.width = `${window.innerWidth}px`;
    app.view.style.height = `${window.innerHeighth}px`;
};

// Game loop function
const gameLoopFunction = dt => {
    if (!debugButtonPushed) {
        newCameraX = -player.position[0] * camera.zoom + app.view.width / 2;
        newCameraY = -player.position[1] * camera.zoom + app.view.height / 2;
        if (camera.x !== newCameraX
            || camera.y !== newCameraY
        ) {
            store.dispatch(setCameraPosition(newCameraX, newCameraY));
        }
    }

    app.stage.x = camera.x;
    app.stage.y = camera.y;
    app.stage.scale.x = camera.zoom;
    app.stage.scale.y = camera.zoom;

    playerSprite.x = player.position[0] - playerSprite.width / 2;
    playerSprite.y = player.position[1] - playerSprite.height / 2;

    physicWorld.step(1 / FPS_WANTED, dt);
};

// Initialisation script, a promise!
const init = level => new Promise(resolvInitialisation => {
    window.addEventListener('pointermove', handlePointerMove, false);
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);
    window.addEventListener('wheel', handleMouseWheel, false);
    window.addEventListener('resize', handleResize, false);

    // Load textures
    loadTextures().then(() => {
        const Level = require(`../../levels/${level}`); // eslint-disable-line
        Level.loadScene(app.stage, physicWorld, collisionLayer);

        // add WebGL canvas container to DOM
        document.getElementById('ViewPort').appendChild(app.view);
        resolvInitialisation();
    });
});

// Start game loop fn
const start = () => {
    console.log('Here is physic world:', physicWorld); // eslint-disable-line no-console

    app.view.style.width = `${window.innerWidth}px`;
    app.view.style.height = `${window.innerHeighth}px`;

    initTestComponent();
    app.ticker.add(gameLoopFunction);
};

const GameEngine = props => {
    const [status, setStatus] = useState('loading');

    // Update camera on application update
    camera.x = props.gameEngine.x;
    camera.y = props.gameEngine.y;
    camera.zoom = props.gameEngine.zoom;

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

const mapStoreToProps = _store => ({
    gameEngine: _store.gameEngine
});

const enhance = compose(
    connect(mapStoreToProps),
    withTranslation()
);

export default enhance(GameEngine);
