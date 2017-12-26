import React, { Component } from 'react';
import '../styles/index.css';

class Index extends Component {
  render() {
    const { main } = this.props;

    const d = new Date();
    const year = d.getFullYear();

    return (
      <div>
        <header>
          <a href="/">
            <img src="/images/logo_banner.png" alt="Cookbook Club" height="100" width="300" />
          </a>
        </header>

        <main className="container">
          {main}
        </main>

        <footer className="footer footer--text">
          &copy; {year} Nancy&apos;s Hearth.  All rights reserved.
        </footer>
      </div>
    );
  }
}

export default Index;
