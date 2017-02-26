import { Router, Route, browserHistory } from 'react-router'
import React from 'react';
import ReactDOM from 'react-dom';

/** VIEWS */
import App from './App';
import Index from './view/Index';
import CookbookList from './view/CookbookList';
import CookbookRecipes from './view/CookbookRecipes';

ReactDOM.render(
 <Router history={browserHistory}>
    <Route component={App}>
      <Route path="/" component={Index} />
      <Route path="/cookbooks" component={CookbookList} />
      <Route path="/recipes/:author/:book" component={CookbookRecipes} />
    </Route>
  </Router>,
  document.getElementById('root')
);
