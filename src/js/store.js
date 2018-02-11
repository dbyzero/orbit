import reducers from './reducers';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import promise from 'redux-promise-middleware';

const log = require('loglevel');
/**
 * Redux middleware
 */

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

const state = {};
const store = createStore(reducers, state, middlewares);

export default store;
