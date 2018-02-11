import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router';

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
                    <li><Link to="/game">{t('menu:Game')}</Link></li>
                    <li><a href="#" onClick={this.onClickQuit.bind(this)}>{t('menu:quit')}</a></li>
                </ul>
            </div>
        );
    }
}

export default translate()(MainMenu);
