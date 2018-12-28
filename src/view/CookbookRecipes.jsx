import React from 'react';
import Helmet, { HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';
import Api from './../controller/Api';
import Spinner from './Spinner';

class CookbookRecipes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      recipes: [],
    };
  }

  componentDidMount() {
    const book = this.props.params.book;
    const author = this.props.params.author;

    Api.getCookbookRecipes(encodeURIComponent(author), encodeURIComponent(book), (recipes) => {
      this.setState({
        book,
        author,
        recipes,
        isLoading: false,
      });
    });
  }

  render() {
    const { book, author, recipes } = this.state;
    const title = `Cookbook Club | ${book}`;
    const description = `Cookbook Club - ${book} by ${author}`;

    let recipeRows = [];

    if (recipes) {
      recipeRows = recipes.map(recipe => (
        <tr
          key={recipe.name}
        >
          <td>
            {recipe.link ?
              <a href={recipe.link} target="_blank">{recipe.name}</a>
              : <span>{recipe.name}</span>
            }
            <span>{recipe.page ? ` (p. ${recipe.page})` : ''}</span>
          </td>
          <td>{recipe.cook}</td>
        </tr>
      ));
    }

    return (
      <div>
        <HelmetProvider>
          <Helmet>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
          </Helmet>
        </HelmetProvider>
        {this.state.isLoading ?
          <Spinner />
          :
          <section>
            <h1 className="recipe_list--heading"><em>{book}</em> by {author}</h1>
            <div className="recipe_list">
              <table>
                <thead>
                  <tr>
                    <th className="recipe_list--title">Recipe</th>
                    <th className="recipe_list--title">Cook</th>
                  </tr>
                </thead>
                <tbody>
                  {recipeRows.length > 0 ?
                    recipeRows
                    : <tr><td colSpan="2">Get hungry!</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        }
      </div>
    );
  }
}

CookbookRecipes.propTypes = {
  params: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default CookbookRecipes;
