import React from 'react';
import { compose } from 'redux';


// HOC
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { showMenuLayer } from '../menuLayer/actions';

import './style.scss';

const UILayer = props => {
    if (props.uiLayer.showUI === false) {
        return null;
    }
    return (
        <div className="uiLayer">
            <div>
                UI
            </div>
            <div>
                <label>
                    <button type="button" onClick={props.showMenuLayer}>
                        Show menu
                    </button>
                </label>
            </div>
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
