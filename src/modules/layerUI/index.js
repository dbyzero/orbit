import React from 'react';
import { compose } from 'redux';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { hideUiLayer } from './actions';
import { showMenuLayer } from '../layerMenu/actions';
import { zoomCamera } from '../gameCamera/actions';

import './style.scss';

const LayerUI = props => {
    if (props.layerUI.showUI === false) {
        return null;
    }
    return (
        <div className="uiLayer">
            <div>
                UI, current zoom:
                {props.gameCamera.zoom}
            </div>
            <button
                type="button"
                onClick={() => {
                    props.showMenuLayer();
                    props.hideUiLayer();
                }}
            >
                Show menu
            </button>
            <button type="button" onClick={() => { props.zoomCamera(1); }}>
                Zoom 1
            </button>
            <button type="button" onClick={() => { props.zoomCamera(2); }}>
                Zoom 2
            </button>
            <button type="button" onClick={() => { props.zoomCamera(3); }}>
                Zoom 3
            </button>
            <button type="button" onClick={() => { props.zoomCamera(4); }}>
                Zoom 4
            </button>
        </div>
    );
};

const mapStoreToProps = store => ({
    gameCamera: store.gameCamera,
    layerUI: store.layerUI
});

const mapDispatchToProps = dispatch => ({
    showMenuLayer: () => dispatch(showMenuLayer()),
    hideUiLayer: () => dispatch(hideUiLayer()),
    zoomCamera: z => dispatch(zoomCamera(z))
});

const enhance = compose(
    connect(mapStoreToProps, mapDispatchToProps),
    withTranslation()
);

export default enhance(LayerUI);
