import { Router, Route, browserHistory } from 'react-router'
import React from 'react';
import ReactDOM from 'react-dom';

/** VIEWS */
import Index from './view/Index';
import CookbookList from './view/CookbookList';
import CookbookRecipes from './view/CookbookRecipes';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route component={Index}>
      <Route path="/" components={{ main: CookbookList }} />
      <Route path="/recipes/:author/:book" components={{ main: CookbookRecipes }} />
    </Route>
  </Router>,
  document.getElementById('root')
);
