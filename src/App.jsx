import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

/** VIEWS */
import Layout from './view/Layout';
import CookbookList from './view/CookbookList';
import CookbookRecipes from './view/CookbookRecipes';
import Recipes from './view/Recipes';

const App = () => (
  <Router history={browserHistory}>
    <Route component={Layout}>
      <Route path="/" components={{ main: CookbookList }} />
      <Route path="/recipes/:author/:book" components={{ main: CookbookRecipes }} />
      <Route path="/recipes" components={{ main: Recipes }} />
    </Route>
  </Router>
);

export default App;
