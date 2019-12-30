import React, { useState, useEffect, useReducer } from 'react';

import {
    World, Box, Body, ContactEquation
} from 'p2';
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
import cameraReducer from './reducer';

const PIXI = require('pixi.js');

const FPS_WANTED = 60;

const GameEngine = props => {
    // variable for gameEngine status
    let debugButtonPushed = false;
    let leftButtonPushed = false;
    let rightButtonPushed = false;
    // TODO camera need to be outside
    const initialCamera = {
        x: 0,
        y: 0,
        zoom: 2
    };
    const [status, setStatus] = useState('loading');
    const [stateCamera, dispatchCamera] = useReducer(cameraReducer, initialCamera);

    // Graphic objects
    const [app] = useState(new PIXI.Application({
        backgroundColor: 0x333333,
        resolution: 1,
        antialias: false,
        forceFXAA: false,
        transparent: false
    }));

    const collisionLayer = new PIXI.Graphics();
    collisionLayer.visible = false;
    collisionLayer.zIndex = 1000;

    // Physical objects
    const physicWorld = new World({
        gravity: [0, 9.82]
    });
    physicWorld.solver.iterations = 1;

    // Handlers
    const handleWindowResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.view.style.width = `${window.innerWidth}px`;
        app.view.style.height = `${window.innerHeighth}px`;
    };

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
    /**
     * ******************************
     *         END TEST           *
     ********************************/

    const handleMouseMove = e => {
        if (debugButtonPushed) {
            stateCamera.x += e.movementX;
            stateCamera.y += e.movementY;
            dispatchCamera(stateCamera);
            console.log(stateCamera);
        }
    };

    const handleMouseWheel = e => {
        if (e.deltaY > 0) {
            stateCamera.zoom = Math.max(0.5, stateCamera.zoom - 0.1);
        } else {
            stateCamera.zoom = Math.min(4, stateCamera.zoom + 0.1);
        }
        dispatchCamera(stateCamera);
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


    // Initialisation script, a promise!
    const init = () => new Promise(resolvInitialisation => {
        PIXI.loader = new PIXI.Loader();

        // add some custom settings
        app.renderer.autoResize = true;
        app.stage.autoResize = true;
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        // bind JS events
        window.addEventListener('pointermove', handleMouseMove, false);
        window.addEventListener('keydown', handleKeyDown, false);
        window.addEventListener('keyup', handleKeyUp, false);
        window.addEventListener('wheel', handleMouseWheel, false);
        window.addEventListener('resize', handleWindowResize, false);

        // load textures
        loadTextures().then(() => {
            const Level = require(`../../levels/${props.level}`); // eslint-disable-line
            Level.loadScene(app.stage, physicWorld, collisionLayer);

            // add WebGL canvas container to DOM
            document.getElementById('ViewPort').appendChild(app.view);
            resolvInitialisation();
        });

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

        // change computeB to block player on ramp
        ContactEquation.prototype.computeB = computeBForRamp;
    });

    const start = () => {
        console.log('Here is physic world:', physicWorld); // eslint-disable-line no-console

        setStatus('ready');

        /**
         * ******************************
         *         START TEST           *
         ********************************/
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

        const playerSprite = PIXI.Sprite.from('debug.png');
        playerSprite.x = player.position[0];
        playerSprite.y = player.position[1] - playerSprite.height / 2;
        playerSprite.width = player.shapes[0].width;
        playerSprite.height = player.shapes[0].height;
        app.stage.addChild(playerSprite);
        app.view.style.width = `${window.innerWidth}px`;
        app.view.style.height = `${window.innerHeighth}px`;
        /**
         * ****************************
         *         END TEST           *
         ******************************/
        let oldCameraX = 0;
        let oldCameraY = 0;
        let newCameraX = 0;
        let newCameraY = 0;
        app.ticker.add(dt => {
            if (!debugButtonPushed) {
                oldCameraX = stateCamera.x;
                oldCameraY = stateCamera.y;
                newCameraX = -player.position[0] * stateCamera.zoom + app.view.width / 2;
                newCameraY = -player.position[1] * stateCamera.zoom + app.view.height / 2;
                if (oldCameraX !== newCameraX
                    || oldCameraY !== newCameraY
                ) {
                    stateCamera.x = newCameraX;
                    stateCamera.y = newCameraY;
                    dispatchCamera(stateCamera);
                }
            }

            physicWorld.step(1 / FPS_WANTED, dt);

            playerSprite.x = player.position[0] - playerSprite.width / 2;
            playerSprite.y = player.position[1] - playerSprite.height / 2;

            app.stage.x = stateCamera.x;
            app.stage.y = stateCamera.y;
            app.stage.scale.x = stateCamera.zoom;
            app.stage.scale.y = stateCamera.zoom;
        });
    };

    useEffect(() => {
        // start initialisation if game start
        setStatus(`initializing ${props.level}`);
        init().then(start);
    }, [props.level]);

    return (
        <div id="ViewPort" className={status} />
    );
};

export default GameEngine;
