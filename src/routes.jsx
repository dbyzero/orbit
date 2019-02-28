import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Modules
import Layout from './modules/layout';
import MainMenu from './modules/mainmenu';
import Scene from './modules/scene/';

export default () =>
    <Route path="/" component={ Layout }>
        <IndexRoute components={ MainMenu }/>
        <Route path="/scene" components={ Scene }/>
    </Route>;
