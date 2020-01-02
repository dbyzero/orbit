import React, { useReducer } from 'react';
import { compose } from 'redux';


// HOC
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { showMenuLayer } from '../menuLayer/actions';
import cameraReducer, { initialState as cameraInitialCamera } from '../gameEngine/reducer';
import { zoomCamera } from '../gameEngine/actions';

import './style.scss';

const UILayer = props => {
    const [stateCamera, dispatchCamera] = useReducer(cameraReducer, cameraInitialCamera);

    if (props.uiLayer.showUI === false) {
        return null;
    }
    return (
        <div className="uiLayer">
            <div>
                UI, current zoom:
                {stateCamera.zoom}
            </div>
            <button type="button" onClick={props.showMenuLayer}>
                Show menu
            </button>
            <button type="button" onClick={() => {dispatchCamera(zoomCamera(1))}}>
                Zoom 1
            </button>
            <button type="button" onClick={() => {dispatchCamera(zoomCamera(2))}}>
                Zoom 2
            </button>
            <button type="button" onClick={() => {dispatchCamera(zoomCamera(3))}}>
                Zoom 3
            </button>
            <button type="button" onClick={() => {dispatchCamera(zoomCamera(4))}}>
                Zoom 4
            </button>
        </div>
    );
};

const mapStoreToProps = store => ({
    uiLayer: store.uiLayer
});

const mapDispatchToProps = dispatch => ({
    showMenuLayer: () => dispatch(showMenuLayer())
});

const enhance = compose(
    connect(mapStoreToProps, mapDispatchToProps),
    withTranslation()
);

export default enhance(UILayer);
