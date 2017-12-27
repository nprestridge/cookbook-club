import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

/** VIEWS */
import Index from './view/Index';
import CookbookList from './view/CookbookList';
import CookbookRecipes from './view/CookbookRecipes';

const App = () => (
  <Router history={browserHistory}>
    <Route component={Index}>
      <Route path="/" components={{ main: CookbookList }} />
      <Route path="/recipes/:author/:book" components={{ main: CookbookRecipes }} />
    </Route>
  </Router>
);

export default App;
