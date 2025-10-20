import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Api from '../controller/Api';
import Spinner from './Spinner';

const formatSlug = (text) => text
  .toLowerCase()
  .replace(/ /g, '-')
  .replace(/[^\w-]+/g, ''); // Remove leading/trailing dashes

class Recipes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      allRecipes: [],
      recipes: [],
      modal: false,
      activeRecipe: {},
      searchTerm: '',
    };

    this.toggle = this.toggle.bind(this);
    this.search = this.search.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  componentDidMount() {
    Api.getRecipes((recipes) => {
      this.setState({
        allRecipes: recipes,
        recipes,
        isLoading: false,
      });
    });
  }

  toggle(activeRecipe) {
    this.setState((prevState) => ({
      modal: !prevState.modal,
      activeRecipe,
    }));
  }

  search(event) {
    const input = event.target.value;
    const filter = input ? input.toLowerCase() : null;
    const { allRecipes } = this.state;

    let filteredRecipes;
    if (filter) {
      filteredRecipes = allRecipes.filter((recipe) => (
        recipe.name.toLowerCase().includes(filter)
          || recipe.cookbook.toLowerCase().includes(filter)
          || recipe.cook.toLowerCase().includes(filter)
      ));
    }

    this.setState({
      recipes: filteredRecipes || allRecipes,
      searchTerm: input,
    });
  }

  clearSearch() {
    const { allRecipes } = this.state;
    this.setState({
      recipes: allRecipes,
      searchTerm: '',
    });
  }

  render() {
    const {
      recipes, isLoading, modal, activeRecipe, searchTerm,
    } = this.state;

    const d = new Date();
    const year = d.getFullYear();

    const title = 'Cookbook Club | Recipes';
    const description = 'Recipe Index';

    let recipeItems = [];

    if (recipes) {
      recipeItems = recipes.map((recipe) => (
        <div className="recipe-list__table recipe-list__row" role="row" key={recipe.name}>
          <div className="recipe-list__item recipe-list__item--recipe" role="cell">
            {recipe.link
              ? <a href={recipe.link} target="_blank" rel="noopener noreferrer">{recipe.name}</a>
              : <span>{recipe.name}</span>}
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
              : null}
          </div>
          <div className="recipe-list__item" role="cell">
            <Link to={`/recipes/${formatSlug(recipe.cookbook)}`}>{recipe.cookbook}</Link>
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
                {description}
              </h1>
              <div className="recipe-container">
                <div role="table" aria-label="Recipe Index">

                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-search" aria-hidden="true" />
                      </span>
                    </div>
                    <input
                      className="form-control"
                      id="recipeSearch"
                      type="text"
                      value={searchTerm}
                      onChange={this.search}
                      placeholder="Search recipes..."
                      aria-label="Search Recipes"
                    />
                    <span
                      className="input-group-text bg-transparent"
                      onClick={this.clearSearch}
                      onKeyDown={this.clearSearch}
                      role="button"
                      aria-label="Clear search"
                      tabIndex="0"
                    >
                      <i className="fas fa-times" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="recipe-list__table recipe-list__header" role="row">
                    <div className="recipe-list__item recipe-list__item--recipe" role="columnheader">Recipe</div>
                    <div className="recipe-list__item" role="columnheader">Cookbook</div>
                    <div className="recipe-list__item" role="columnheader">Cook</div>
                  </div>
                  {recipeItems}
                </div>
              </div>
            </section>
          )}

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
                  : null}
              </figcaption>
            </figure>

          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Recipes;
