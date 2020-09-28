import React from 'react';
import Helmet, { HelmetProvider } from 'react-helmet-async';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Api from '../controller/Api';
import Spinner from './Spinner';

class Recipes extends React.Component {
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
    Api.getRecipes((recipes) => {
      this.setState({
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
      recipes, isLoading, modal, activeRecipe,
    } = this.state;

    const d = new Date();
    const year = d.getFullYear();

    const title = 'Cookbook Club | Recipes';
    const description = 'Recipe Index';

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
                  className="recipe-list__camera-icon"
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
          <td>{recipe.cookbook}</td>
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
              <h1 className="cookbook-header">
                <em>{description}</em>
              </h1>
              <div className="recipe-list">
                <table>
                  <thead>
                    <tr>
                      <th className="recipe-list__header">Recipe</th>
                      <th className="recipe-list__header">Cookbook</th>
                      <th className="recipe-list__header">Cook</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipeRows}
                  </tbody>
                </table>
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

export default Recipes;
