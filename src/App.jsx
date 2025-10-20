import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, browserHistory } from 'react-router';

/** VIEWS */
import Layout from './view/Layout';
import CookbookList from './view/CookbookList';
import CookbookRecipes from './view/CookbookRecipes';
import Recipes from './view/Recipes';
import Spinner from './view/Spinner';
import Api from './controller/Api';
import CookbookStore from './controller/CookbookStore';

class CookbookRecipesRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    const { params } = this.props;
    const book = CookbookStore.getCookbookBySlug(params.slug);

    if (!book) {
      Api.getCookbooks((books) => {
        CookbookStore.setCookbooks(books);
        this.setState({ isLoading: false });
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { params } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return <Spinner />;
    }

    const book = CookbookStore.getCookbookBySlug(params.slug);
    return book ? <CookbookRecipes author={book.author} title={book.title} /> : null;
  }
}

CookbookRecipesRoute.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

const App = () => (
  <Router history={browserHistory}>
    <Route component={Layout}>
      <Route path="/" components={{ main: CookbookList }} />
      <Route
        path="/recipes/:slug"
        components={{
          main: CookbookRecipesRoute,
        }}
      />
      <Route path="/recipes" components={{ main: Recipes }} />
    </Route>
  </Router>
);

export default App;
