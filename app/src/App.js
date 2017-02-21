import React, { Component } from 'react';
import './App.css';

import CookbookList from './CookbookList';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Cookbook Club Meeting Suggestions</h2>
        </div>

        <CookbookList
        />
      </div>
    );
  }
  
}

export default App;
