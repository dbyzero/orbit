import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Modules
import Layout from './modules/layout';
import MainMenu from './modules/mainmenu';
import Game from './modules/game/';

export default () =>
    <Route path="/" component={ Layout }>
        <IndexRoute components={ MainMenu }/>
        <Route path="/game" components={ Game }/>
    </Route>;
