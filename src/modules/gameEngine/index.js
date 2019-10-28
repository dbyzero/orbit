import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import loadTextures from './loadTextures';
import {
    loadScene as loadSceneDemo,
    updateScene as updateSceneDemo,
    loadCollisionLayer as loadCollisionLayerDemo
} from '../../levels/demo';

const PIXI = require('pixi.js');

const GameEngine = () => {
    let debugButtonPushed = null;
    const collisionLayer = new PIXI.Graphics();
    collisionLayer.visible = false;
    collisionLayer.zIndex = 1000;

    const [status, setStatus] = useState(null);
    const [app] = useState(new PIXI.Application({
        backgroundColor: 0x333333,
        resolution: 1,
        antialias: false,
        forceFXAA: false,
        transparent: false
    }));

    const handleWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        app.view.style.width = `${width}px`;
        app.view.style.height = `${height}px`;
        app.renderer.resize(width, height);
    };

    const handleMouseMove = e => {
        if (debugButtonPushed === 'pusched') {
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
            debugButtonPushed = 'pusched';
            collisionLayer.visible = true;
        }
    };

    const handleKeyUp = e => {
        if (e.key === 'Control') {
            debugButtonPushed = null;
            collisionLayer.visible = false;
        }
    };

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
            loadSceneDemo(app.stage);
            loadCollisionLayerDemo(app.stage, collisionLayer);

            app.stage.width = 2 * app.stage.width;
            app.stage.height = 2 * app.stage.height;

            // add WebGL canvas container to DOM
            document.getElementById('ViewPort').appendChild(app.view);
            resolvInitialisation();
        });
    });

    const start = () => {
        setStatus('ready');
        app.ticker.add(updateSceneDemo);
    };

    useEffect(() => {
        // start initialisation if game start
        setStatus('initializing');
        init().then(start);
    }, []);

    return (
        <div id="ViewPort" />
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
