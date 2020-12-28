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
        <div className="recipe-list__table recipe-list__row" role="row" key={recipe.name}>
          <div className="recipe-list__item recipe-list__item--recipe" role="cell">
            {recipe.link
              ? <a href={recipe.link} target="_blank" rel="noopener noreferrer">{recipe.name}</a>
              : <span>{recipe.name}</span>
            }
            <span>{recipe.page ? ` (p. ${recipe.page})` : ''}</span>
            {recipe.image
              ? (
                <span
                  className="recipe-list__camera-icon"
                  onClick={() => this.toggle(recipe)}
                  onKeyPress={() => this.toggle(recipe)}
                  role="button"
                  tabIndex="0"
                  aria-label="View Recipe Photo"
                >
                  <i className="fas fa-camera fa-lg" />
                </span>
              )
              : null
            }
          </div>
          <div className="recipe-list__item" role="cell">{recipe.cook}</div>
        </div>
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
              <h1 className="cookbook-header">
                <em>{book}</em>
                &nbsp;by&nbsp;
                {author}
              </h1>
              <div className="recipe-container">
                <div role="table" aria-label="Recipe Index">
                  <div className="recipe-list__table recipe-list__header" role="row">
                    <div className="recipe-list__item recipe-list__item--recipe" role="columnheader">Recipe</div>
                    <div className="recipe-list__item" role="columnheader">Cook</div>
                  </div>
                  {recipeRows.length > 0
                    ? recipeRows
                    : <div className="recipe-list__item" role="columnheader">Get hungry!</div>
                  }
                </div>
              </div>
            </section>
          )
        }

        <Modal isOpen={modal} toggle={this.toggle} className="recipe-image">
          <ModalHeader toggle={this.toggle} className="recipe-image__header">{activeRecipe.name}</ModalHeader>
          <ModalBody className="recipe-image__modal">
            <figure>
              <img
                src={activeRecipe.image}
                alt={activeRecipe.name}
              />
              <footer className="recipe-image__copyright">
                <small>
                  &copy;&nbsp;
                  {year}
                  &nbsp;Nancy&apos;s Hearth
                </small>
              </footer>
              <figcaption className="recipe-image__link">
                {activeRecipe.link
                  ? <a href={activeRecipe.link} target="_blank" rel="noopener noreferrer">Recipe</a>
                  : null
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
