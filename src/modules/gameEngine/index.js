import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
    World, Box, Body
} from 'p2';

import loadTextures from './loadTextures';

const PIXI = require('pixi.js');

const FPS_WANTED = 60;

const GameEngine = props => {
    // variable for gameEngine status
    let debugButtonPushed = false;
    let leftButtonPushed = false;
    let rightButtonPushed = false;
    const [status, setStatus] = useState('loading');

    const testBody = new Body({
        mass: 5,
        position: [930, 100],
        velocity: [0, 0],
        fixedRotation: true
    });

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

    // Handlers
    const handleWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        app.view.style.width = `${width}px`;
        app.view.style.height = `${height}px`;
        app.renderer.resize(width, height);
    };

    app.stage.x = -1400;
    const handleMouseMove = e => {
        if (debugButtonPushed) {
            app.stage.x = app.stage.x + e.movementX;
            app.stage.y = app.stage.y + e.movementY;
        }
    };

    const handleMouseWheel = e => {
        if (e.deltaY > 0) {
            app.stage.width = app.stage.width * 0.95;
            app.stage.height = app.stage.height * 0.95;
        } else {
            app.stage.width = app.stage.width / 0.95;
            app.stage.height = app.stage.height / 0.95;
        }
    };

    const handleKeyDown = e => {
        if (e.key === 'Control') {
            debugButtonPushed = true;
            collisionLayer.visible = true;
        }
        if (e.key === 'ArrowLeft') {
            leftButtonPushed = true;
        }
        if (e.key === 'ArrowRight') {
            rightButtonPushed = true;
        }
        if (e.key === 'ArrowUp') {
            testBody.velocity[1] = -50;
        }
    };

    const handleKeyUp = e => {
        if (e.key === 'Control') {
            debugButtonPushed = false;
            collisionLayer.visible = false;
        }
        if (e.key === 'ArrowLeft') {
            testBody.velocity[0] = 0;
            leftButtonPushed = false;
        }
        if (e.key === 'ArrowRight') {
            testBody.velocity[0] = 0;
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
        handleWindowResize();
        window.addEventListener('resize', handleWindowResize, false);
        window.addEventListener('pointermove', handleMouseMove, false);
        window.addEventListener('keydown', handleKeyDown, false);
        window.addEventListener('keyup', handleKeyUp, false);
        window.addEventListener('wheel', handleMouseWheel, false);

        // load textures
        loadTextures().then(() => {
            const Level = require(`../../levels/${props.level}`);
            Level.loadScene(app.stage, physicWorld, collisionLayer);

            // add WebGL canvas container to DOM
            document.getElementById('ViewPort').appendChild(app.view);
            resolvInitialisation();
        });

        // physicWorld.on('impact', (a, b) => {
            // console.log(a, b);
        // });

        physicWorld.on('postStep', () => {
            if (rightButtonPushed) {
                testBody.velocity[0] = 10;
            }
            if (leftButtonPushed) {
                testBody.velocity[0] = -10;
            }
        });
    });

    const start = () => {
        setStatus('ready');

        /**
         * ******************************
         *         START TEST           *
         ********************************/
        const testShape = new Box({
            width: 10,
            height: 10,
            boundingRadius: 10
        });
        testBody.addShape(testShape);
        physicWorld.addBody(testBody);

        const testPhysic = PIXI.Sprite.from('debug.png');
        console.log(testBody);
        testPhysic.x = testBody.position[0];
        testPhysic.y = testBody.position[1];
        testPhysic.width = testBody.shapes[0].width;
        testPhysic.height = testBody.shapes[0].height;
        app.stage.addChild(testPhysic);
        /**
         * ****************************
         *         END TEST           *
         ******************************/

        app.stage.width *= 2;
        app.stage.height *= 2;

        app.ticker.add(dt => {
            physicWorld.step(1 / FPS_WANTED, dt);
            /**
             * ******************************
             *         START TEST           *
             ********************************/
            testPhysic.x = testBody.position[0] - testPhysic.width / 2;
            testPhysic.y = testBody.position[1] - testPhysic.height / 2;
            // console.log(`${testPhysic.x} ${testPhysic.y}`);
            /**
             * ****************************
             *         END TEST           *
             ******************************/
        });
    };

    useEffect(() => {
        // start initialisation if game start
        setStatus(`initializing ${props.level}`);
        init().then(start);
    }, [props.level]);

    console.log(`Status: ${status}`);

    return (
        <div id="ViewPort" className={status} />
    );
};

const mapStoreToProps = store => ({
    menuLayer: store.menuLayer
});

// const mapDispatchToProps = dispatch => ({
//     toggleGameLayer: () => dispatch(toggleGameLayer())
// });

const enhance = compose(
    connect(mapStoreToProps, null)
);

export default enhance(GameEngine);
