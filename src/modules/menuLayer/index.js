import React from 'react';
import { compose } from 'redux';

// HOC
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { hideMenuLayer } from './actions';
import { showUiLayer } from '../uiLayer/actions';

import './style.scss';

const MenuLayer = props => {
    if (props.menuLayer.showMenu === false) {
        return null;
    }
    return (
        <div className="menuLayer">
            <div>
                Menu
            </div>
            <button
                type="button"
                onClick={() => {
                    props.hideMenuLayer();
                    props.showUiLayer();
                }}
            >
                Load game test 1
            </button>
        </div>
    );
};

const mapStoreToProps = store => ({
    menuLayer: store.menuLayer
});

const mapDispatchToProps = dispatch => ({
    hideMenuLayer: () => dispatch(hideMenuLayer()),
    showUiLayer: () => dispatch(showUiLayer())
});

const enhance = compose(
    connect(mapStoreToProps, mapDispatchToProps),
    withTranslation()
);

export default enhance(MenuLayer);
