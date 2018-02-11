import { combineReducers } from 'redux';

import loaderReducer from './loaderReducer';
import cameraReducer from './cameraReducer';
import gameSceneReducer from './gameSceneReducer';

const storeApp = combineReducers({
    loader: loaderReducer,
    gameScene: gameSceneReducer,
    camera: cameraReducer
});

export default storeApp;
