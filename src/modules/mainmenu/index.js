import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router';

import './style.scss';

class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onClickNewGame(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    onClickQuit(e) {
        e.preventDefault();
        e.stopPropagation();
        window.close();
        return false;
    }

    render() {
        const { t } = this.props;

        return (
            <div className="menu main-menu">
                <ul>
                    <li>Orbit Engine</li>
                    <li>&nbsp;</li>
                    <li><a href="#" onClick={() => {debugger;this.props.history.push('/scene')}}>{t('menu:scene')} 1</a></li>
                    <li><Link to="/scene">{t('menu:scene')} 2</Link></li>
                    <li><Link to="/scene">{t('menu:scene')} 3</Link></li>
                    <li><a href="#" onClick={this.onClickQuit.bind(this)}>{t('menu:Quit')}</a></li>
                </ul>
            </div>
        );
    }
}

export default translate()(MainMenu);
