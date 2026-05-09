import { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Api from '../controller/Api';
import Spinner from './Spinner';

function CookbookRecipes(
  { params = null, author: propAuthor = null, title: propTitle = null } = {},
) {
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState({});
  const [book, setBook] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    const authorFromProps = propAuthor || params?.author || '';
    const bookFromProps = propTitle || params?.book || '';

    Api.getCookbookRecipes(
      encodeURIComponent(authorFromProps),
      encodeURIComponent(bookFromProps),
      (fetchedRecipes) => {
        setBook(bookFromProps);
        setAuthor(authorFromProps);
        setRecipes(fetchedRecipes);
        setIsLoading(false);
      },
    );
  }, [params, propAuthor, propTitle]);

  const toggle = (recipeToShow) => {
    setModal((current) => !current);
    setActiveRecipe(recipeToShow || {});
  };

  const year = new Date().getFullYear();
  const title = `Cookbook Club | ${book}`;
  const description = `${book} by ${author}`;

  const recipeRows = recipes.map((recipe) => (
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
              onClick={() => toggle(recipe)}
              onKeyPress={() => toggle(recipe)}
              role="button"
              tabIndex="0"
              aria-label="View Recipe Photo"
            >
              <i className="fas fa-camera fa-lg" />
            </span>
          )
          : null}
      </div>
      <div className="recipe-list__item" role="cell">{recipe.cook}</div>
    </div>
  ));

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
                  : <div className="recipe-list__item" role="columnheader">Get hungry!</div>}
              </div>
            </div>
          </section>
        )}

      <Modal isOpen={modal} toggle={() => toggle()} className="recipe-image">
        <ModalHeader toggle={() => toggle()} className="recipe-image__header">{activeRecipe.name}</ModalHeader>
        <ModalBody className="recipe-image__modal">
          <figure>
            <img
              src={activeRecipe.image}
              alt={activeRecipe.name}
            />
            <footer className="recipe-list__copyright">
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

CookbookRecipes.propTypes = {
  params: PropTypes.shape({
    author: PropTypes.string,
    book: PropTypes.string,
  }),
  author: PropTypes.string,
  title: PropTypes.string,
};

export default CookbookRecipes;
