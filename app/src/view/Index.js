import React, { Component } from 'react';
import { Link } from 'react-router';
import logo from './logo.svg';
import CookbookList from './CookbookList';
import './Index.css';

class Index extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Cookbook Club!</h2>
        </div>
        <div>
          <CookbookList />
        </div>
      </div>
    );
  }
}

export default Index;
