import React, { Component } from 'react';
import CookbookList from './CookbookList';
import './Index.css';
import './Cookbook.css';

class Index extends Component {
  render() {
    return (
      <div className="App">

        <header className="header">
          <img src="logo_banner.png" alt="Cookbook Club" height="100" width="300" />
        </header>

        <main className="content">
          <CookbookList />
        </main>

      </div>
    );
  }
}

export default Index;
