import * as PIXI from 'pixi.js';
import store from '../../store';
import {
    setGraphicEngine,
    setDebugLayer
} from './actions';

const initGraphicEngine = () => {
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
    app.view.style.height = `${window.innerHeight}px`;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    store.dispatch(setGraphicEngine(app));

    // debug purpose
    const debugLayer = new PIXI.Graphics();
    debugLayer.visible = false;
    debugLayer.zIndex = 1000;
    store.dispatch(setDebugLayer(debugLayer));
};

export default initGraphicEngine;
