import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n';
import store from './store';

// SCSS
import AppLayout from './modules/appLayout';
import Loader from './modules/loader';
import LayerMenu from './modules/layerMenu';
import LayerUI from './modules/layerUI';
import LayerGame from './modules/layerGame';

ReactDOM.render(
    <Suspense fallback={<Loader />}>
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <AppLayout>
                    <LayerGame />
                    <LayerUI />
                    <LayerMenu />
                </AppLayout>
            </Provider>
        </I18nextProvider>
    </Suspense>
    , document.getElementById('root')
);
