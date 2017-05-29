import React, { Component } from 'react';
import CookbookList from './CookbookList';
import './Index.css';
import './Cookbook.css';

class Index extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          Welcome to Cookbook Club!
        </div>
        <div>
          <CookbookList />
        </div>
      </div>
    );
  }
}

export default Index;
