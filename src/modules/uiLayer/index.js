import React from 'react';
import { compose } from 'redux';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { showMenuLayer } from '../menuLayer/actions';
import { zoomCamera } from '../gameEngine/actions';

import './style.scss';

const UILayer = props => {
    if (props.uiLayer.showUI === false) {
        return null;
    }
    return (
        <div className="uiLayer">
            <div>
                UI, current zoom:
                {props.gameEngine.zoom}
            </div>
            <button type="button" onClick={props.showMenuLayer}>
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
    gameEngine: store.gameEngine,
    uiLayer: store.uiLayer
});

const mapDispatchToProps = dispatch => ({
    showMenuLayer: () => dispatch(showMenuLayer()),
    zoomCamera: z => dispatch(zoomCamera(z))
});

const enhance = compose(
    connect(mapStoreToProps, mapDispatchToProps),
    withTranslation()
);

export default enhance(UILayer);
