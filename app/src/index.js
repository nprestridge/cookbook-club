import { Router, Route, browserHistory } from 'react-router'
import React from 'react';
import ReactDOM from 'react-dom';

/** VIEWS */
import App from './App';
import Index from './view/Index';
import CookbookList from './view/CookbookList';

ReactDOM.render(
 <Router history={browserHistory}>
    <Route component={App}>
      <Route path="/" component={Index} />
      <Route path="/cookbooks" component={CookbookList} />
    </Route>
  </Router>,
  document.getElementById('root')
);
