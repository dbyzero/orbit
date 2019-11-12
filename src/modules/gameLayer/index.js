import React from 'react';
import { compose } from 'redux';

// HOC
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import GameEngine from '../gameEngine';

import './style.scss';

const GameLayer = () => (
    <div className="gameLayer">
        <div>
            <GameEngine level="demo" />
        </div>
    </div>
);

const mapStoreToProps = store => ({
    gameLayer: store.gameLayer
});

// const mapDispatchToProps = dispatch => ({
//     toggleGameLayer: () => dispatch(toggleGameLayer())
// });

const enhance = compose(
    connect(mapStoreToProps, null),
    withTranslation()
);

export default enhance(GameLayer);
