import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import promise from 'redux-promise-middleware';
import log from 'loglevel';

import config from './config';

const reducers = {};
config.modules.forEach(module => {
    try {
        reducers[module] = require('./modules/' + module + '/reducer').default;
    } catch (e) {
        console.error('Warrning: cannot load reducer for module "' + module + '"');
    }
});

// error middleware
const error = (/* store */) => (next) => (action) => {
    try {
        next(action);
    } catch (e) {
        log.error('Error catch in error middleware:\n', e);
    }
};

let middlewares;
if (IS_PRODUCTION) {
    middlewares = applyMiddleware(promise(), error, {});
} else {
    middlewares = applyMiddleware(promise(), error, createLogger({
        duration: true
    }));
}

const store = createStore(combineReducers(reducers), {}, middlewares);
console.log(store);

export default store;
