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
