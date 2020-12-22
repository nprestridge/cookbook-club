import { Link } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/index.css';

class Layout extends React.PureComponent {
  constructor(props) {
    super(props);
    const { main } = props;

    this.state = {
      main,
      showNav: '',
    };
  }

  componentDidUpdate(prevProps) {
    this.updateMainComponent(prevProps.main);
  }

  updateMainComponent(prevMain) {
    const { main } = this.props;
    if (prevMain !== main) {
      this.setState({
        main,
        showNav: '',
      });
    }
  }

  toggleNav() {
    const {
      showNav,
    } = this.state;

    this.setState({
      showNav: (showNav === '') ? 'nav__toggle--active' : '',
    });
  }

  render() {
    const {
      showNav,
      main,
    } = this.state;

    const d = new Date();
    const year = d.getFullYear();

    return (
      <div>
        <header>
          <nav>
            <span className="nav__toggle" role="presentation" onClick={this.toggleNav.bind(this)} onKeyDown={this.toggleNav.bind(this)}>
              <i className="fas fa-bars fa-sm" />
            </span>
            <div className="logo">
              <Link to="/">
                <img src="/images/logo_banner_w300.png" alt="Cookbook Club" height="100" width="300" />
              </Link>
            </div>
            <ul className={showNav}>
              <li><Link to="/">Cookbooks</Link></li>
              <li><Link to="/recipes">Recipes</Link></li>
            </ul>
          </nav>
        </header>

        <main className="container">
          {main}
        </main>

        <footer className="page-footer">
          &copy;&nbsp;
          {year}
          &nbsp;Nancy&apos;s Hearth.  All rights reserved.
        </footer>
      </div>
    );
  }
}

Layout.propTypes = {
  main: PropTypes.element.isRequired,
};

export default Layout;
