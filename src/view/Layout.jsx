import { Link, Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import '../styles/index.css';

function Layout() {
  const [showNav, setShowNav] = useState('');

  const toggleNav = () => {
    setShowNav((prev) => (prev === '' ? 'nav__toggle--active' : ''));
  };

  const year = new Date().getFullYear();

  return (
    <div>
      <header>
        <nav>
          <span
            className="nav__toggle"
            role="presentation"
            onClick={toggleNav}
            onKeyDown={toggleNav}
          >
            <i className="fas fa-bars fa-sm" />
          </span>
          <div className="logo">
            <Link to="/">
              <img
                src="/images/logo_banner_w300.png"
                alt="Cookbook Club"
                height="100"
                width="300"
              />
            </Link>
          </div>
          <ul className={showNav}>
            <li><Link to="/">Cookbooks</Link></li>
            <li><Link to="/recipes">Recipes</Link></li>
          </ul>
        </nav>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <footer className="page-footer">
        &copy;&nbsp;
        {year}
        &nbsp;Nancy&apos;s Hearth.  All rights reserved.
      </footer>
    </div>
  );
}

export default Layout;
