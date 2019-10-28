import {
    put, takeLatest
} from 'redux-saga/effects';
import {
    TEST_ACTION,
    TEST_ACTION_2
} from './actions';

function *testAction1() {
    yield put({ type: 'TEST_ACTION_1_FULLFILED', payload: {} });
}

function *testAction2() {
    yield put({ type: 'TEST_ACTION_2_FULLFILED', payload: {} });
}

export default function *Saga() {
    yield [
        yield takeLatest(TEST_ACTION, testAction1),
        yield takeLatest(TEST_ACTION_2, testAction2)
    ];
}
