import React from 'react';
import { compose } from 'redux';

// HOC
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import './style.scss';

const Layout = props => (
    <div className="layout">
        { props.children }
    </div>
);

const enhance = compose(
    connect(null, null),
    withTranslation()
);

export default enhance(Layout);
