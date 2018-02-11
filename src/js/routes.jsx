import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Top page
import Layout from './components/Layout.jsx';
import MainMenu from './components/menu/MainMenu.jsx';
import Game from './components/game/Game.jsx';
import Test1 from './components/test/Test1.jsx';

export default () =>
    <Route path="/" component={ Layout }>
        <IndexRoute components={ MainMenu }/>
        <Route path="/game" components={ Game }/>
    </Route>;
