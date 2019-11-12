import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n';
import store from './store';

// SCSS
import Layout from './modules/layout';
import Loader from './modules/loader';
import MenuLayer from './modules/menuLayer';
import UILayer from './modules/uiLayer';
import GameLayer from './modules/gameLayer';

ReactDOM.render(
    <Suspense fallback={<Loader />}>
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <Layout>
                    <GameLayer />
                    <UILayer />
                    <MenuLayer />
                </Layout>
            </Provider>
        </I18nextProvider>
    </Suspense>
    , document.getElementById('root')
);
