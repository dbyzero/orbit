/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import {
    createStore, applyMiddleware, combineReducers
} from 'redux';
import { all } from 'redux-saga/effects';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

// Bootstrap reducers
const reducers_required = {};
['test', 'menuLayer', 'uiLayer'].forEach(reducer => {
    reducers_required[reducer] = require(`./modules/${ reducer }/reducer`).default;
});
const reducers = combineReducers(reducers_required);

// Bootstrap saga and middleware
const sagaMiddleware = createSagaMiddleware();
const middlewares = IS_PRODUCTION ? applyMiddleware(sagaMiddleware)
    : applyMiddleware(sagaMiddleware, createLogger({ duration: true }));

// Bootstrap store
const state = {};
const store = createStore(reducers, state, middlewares);

// Start Saga
function *RootSaga() {
    yield all(['test'].map(saga => require(`./modules/${ saga }/saga`).default()));
}
sagaMiddleware.run(RootSaga);

export default store;
