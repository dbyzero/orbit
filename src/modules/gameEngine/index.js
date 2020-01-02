// Libs
import React, { useState, useEffect } from 'react';
import {
    World, Box, Body, ContactEquation
} from 'p2';
import * as PIXI from 'pixi.js';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';



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
    position: [930, 100],
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

const GameEngine = props => {
    const [status, setStatus] = useState('loading');

    camera.x = props.gameEngine.x;
    camera.y = props.gameEngine.y;
    camera.zoom = props.gameEngine.zoom;

    // Initialisation script, a promise!
    const init = () => new Promise(resolvInitialisation => {
        // bind JS events
        window.addEventListener('pointermove', e => {
            if (debugButtonPushed) {
                props.moveCamera(e.movementX, e.movementY);
            }
        }, false);
        window.addEventListener('keydown', e => {
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
                props.zoomCamera(1);
            }
        }, false);
        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowLeft') {
                player.velocity[0] = 0;
                leftButtonPushed = false;
            }
            if (e.key === 'ArrowRight') {
                player.velocity[0] = 0;
                rightButtonPushed = false;
            }
        }, false);
        window.addEventListener('wheel', e => {
            if (e.deltaY > 0) {
                props.zoomCamera(Math.max(0.5, camera.zoom - 0.1));
            } else {
                props.zoomCamera(Math.min(4, camera.zoom + 0.1));
            }
            e.stopPropagation();
        }, false);
        window.addEventListener('resize', () => {
            app.renderer.resize(window.innerWidth, window.innerHeight);
            app.view.style.width = `${window.innerWidth}px`;
            app.view.style.height = `${window.innerHeighth}px`;
        }, false);

        // Load textures
        loadTextures().then(() => {
            const Level = require(`../../levels/${props.level}`); // eslint-disable-line
            Level.loadScene(app.stage, physicWorld, collisionLayer);

            // add WebGL canvas container to DOM
            document.getElementById('ViewPort').appendChild(app.view);
            resolvInitialisation();
        });
    });

    const gameLoopFunction = dt => {
        if (!debugButtonPushed) {
            newCameraX = -player.position[0] * camera.zoom + app.view.width / 2;
            newCameraY = -player.position[1] * camera.zoom + app.view.height / 2;
            if (camera.x !== newCameraX
                || camera.y !== newCameraY
            ) {
                props.setCameraPosition(newCameraX, newCameraY);
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

    const start = () => {
        console.log('Here is physic world:', physicWorld); // eslint-disable-line no-console
        setStatus('ready');

        initTestComponent();
        app.ticker.add(gameLoopFunction);
    };

    useEffect(() => {
        setStatus(`initializing ${props.level}`);
        init().then(start);
    }, [props.level]);

    return (
        <div id="ViewPort" className={status} />
    );
};

const mapStoreToProps = store => ({
    gameEngine: store.gameEngine
});

const mapDispatchToProps = dispatch => ({
    moveCamera: (x, y) => dispatch(moveCamera(x, y)),
    zoomCamera: z => dispatch(zoomCamera(z)),
    setCameraPosition: (x, y) => dispatch(setCameraPosition(x, y))
});

const enhance = compose(
    connect(mapStoreToProps, mapDispatchToProps),
    withTranslation()
);

export default enhance(GameEngine);
