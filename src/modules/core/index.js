// Libs
import moment from 'moment';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { I18nextProvider } from 'react-i18next';

// Componemt
import store from '../../store';
import i18n from '../../i18n';
import getRoutes from '../../routes.jsx';

// Style
import './style.scss';

const startApp = () => {
    const rootElement = document.getElementById('root');
    render(
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <Router history={browserHistory}>
                    {getRoutes()}
                </Router>
            </Provider>
        </I18nextProvider>,
        rootElement
    );
};
setTimeout(startApp, 200);

console.log('\n'+
' ██████╗ ██████╗ ██████╗ ██╗████████╗\n' +
'██╔═══██╗██╔══██╗██╔══██╗██║╚══██╔══╝\n' +
'██║   ██║██████╔╝██████╔╝██║   ██║   \n' +
'██║   ██║██╔══██╗██╔══██╗██║   ██║   \n' +
'╚██████╔╝██║  ██║██████╔╝██║   ██║   \n' +
' ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝   \n' +
'\n'+
'Version '+VERSION+' - Copyright '+moment().format('YYYY') + ' Orbit');
