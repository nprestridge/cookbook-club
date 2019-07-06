import React from 'react';
import Helmet, { HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Api from '../controller/Api';
import Spinner from './Spinner';

class CookbookRecipes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      recipes: [],
      modal: false,
      activeRecipe: {},
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { params } = this.props;
    const { book, author } = params;

    Api.getCookbookRecipes(encodeURIComponent(author), encodeURIComponent(book), (recipes) => {
      this.setState({
        book,
        author,
        recipes,
        isLoading: false,
      });
    });
  }

  toggle(activeRecipe) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      activeRecipe,
    }));
  }

  render() {
    const {
      book, author, recipes, isLoading, modal, activeRecipe,
    } = this.state;

    const d = new Date();
    const year = d.getFullYear();

    const title = `Cookbook Club | ${book}`;
    const description = `${book} by ${author}`;

    let recipeRows = [];

    if (recipes) {
      recipeRows = recipes.map(recipe => (
        <tr
          key={recipe.name}
        >
          <td>
            {recipe.link
              ? <a href={recipe.link} target="_blank" rel="noopener noreferrer">{recipe.name}</a>
              : <span>{recipe.name}</span>
            }
            <span>{recipe.page ? ` (p. ${recipe.page})` : ''}</span>
            {recipe.image
              ? (
                <span
                  className="camera--link"
                  onClick={() => this.toggle(recipe)}
                  onKeyPress={() => this.toggle(recipe)}
                  role="button"
                  tabIndex="0"
                >
                  <i className="fa fa-camera fa-sm" />
                </span>
              )
              : null
            }
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
        {isLoading
          ? <Spinner />
          : (
            <section>
              <h1 className="recipe_list--heading">
                <em>{book}</em>
                &nbsp;by&nbsp;
                {author}
              </h1>
              <div className="recipe_list">
                <table>
                  <thead>
                    <tr>
                      <th className="recipe_list--title">Recipe</th>
                      <th className="recipe_list--title">Cook</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipeRows.length > 0
                      ? recipeRows
                      : <tr><td colSpan="2">Get hungry!</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          )
        }

        <Modal isOpen={modal} toggle={this.toggle} className="recipe_image">
          <ModalHeader toggle={this.toggle} className="recipe_image--header">{activeRecipe.name}</ModalHeader>
          <ModalBody>
            <figure>
              <img
                src={activeRecipe.image}
                alt={activeRecipe.name}
              />
              <footer className="recipe_image--copyright">
                <small>
                  &copy;&nbsp;
                  {year}
                  &nbsp;Nancy&apos;s Hearth
                </small>
              </footer>
              <figcaption className="recipe_image--link">
                {activeRecipe.link
                  ? <a href={activeRecipe.link} target="_blank" rel="noopener noreferrer">Recipe</a>
                  : <span>{activeRecipe.name}</span>
                }
              </figcaption>
            </figure>

          </ModalBody>
        </Modal>
      </div>
    );
  }
}

CookbookRecipes.propTypes = {
  params: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default CookbookRecipes;
