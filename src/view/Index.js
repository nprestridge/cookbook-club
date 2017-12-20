import React, { Component } from 'react';
import './Index.css';

class Index extends Component {
  render() {
    const { main } = this.props;
    return (
      <div>
        <header className="header">
          <a href="/">
            <img src="/logo_banner.png" alt="Cookbook Club" height="100" width="300" />
          </a>
        </header>

        <main className="content">
          {main}
        </main>
      </div>
    );
  }
}

export default Index;
