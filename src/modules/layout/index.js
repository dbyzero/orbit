import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Favicon from 'react-favicon';

class Layout extends React.Component {
    componentDidMount() {
        const appLoader = document.getElementById('app-loader');
        if (appLoader) {
            appLoader.style.opacity = 0;
            setTimeout(() => {
                appLoader.parentNode.removeChild(appLoader);
            }, 1000);
        }
    }
    render() {
        let faviconUrl = '/favicon.png';
        return (
            <div>
                <Favicon url={faviconUrl}/>
                { this.props.children }
            </div>
        );
    }
}

export default connect((store) => {
    return {
        loader: store.loader
    };
})(translate()(Layout));
