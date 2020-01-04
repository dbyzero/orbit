import * as PIXI from 'pixi.js';
import store from '../../store';
import {
    setGraphicEngine,
    setDebugLayer
} from './actions';
import {
    setCameraPosition
} from '../gameCamera/actions';

export function initGraphicEngine() {
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
    app.stage.sortableChildren = true;
    app.view.style.width = `${window.innerWidth}px`;
    app.view.style.height = `${window.innerHeight}px`;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    store.dispatch(setGraphicEngine(app));

    // debug purpose
    const debugLayer = new PIXI.Graphics();
    debugLayer.visible = false;
    debugLayer.zIndex = 1000;
    store.dispatch(setDebugLayer(debugLayer));
}

let newCameraX;
let newCameraY;
export function updateGraphicEngine() {
    const state = store.getState();

    // update player position
    state.gameScene.player.render();

    // update main scene depends on camera
    state.gameEngine.graphicEngine.stage.x = state.gameCamera.x;
    state.gameEngine.graphicEngine.stage.y = state.gameCamera.y;
    state.gameEngine.graphicEngine.stage.scale.x = state.gameCamera.zoom;
    state.gameEngine.graphicEngine.stage.scale.y = state.gameCamera.zoom;

    // follow player if in normal mode
    if (state.gameEngine.debugModeActive === false) {
        newCameraX = -state.gameScene.player.physicObject.position[0]
            * state.gameCamera.zoom + state.gameEngine.graphicEngine.view.width / 2;
        newCameraY = -state.gameScene.player.physicObject.position[1]
            * state.gameCamera.zoom + state.gameEngine.graphicEngine.view.height / 2;
        if (state.gameCamera.x !== newCameraX
            || state.gameCamera.y !== newCameraY
        ) {
            store.dispatch(setCameraPosition(newCameraX, newCameraY));
        }
    }
}
