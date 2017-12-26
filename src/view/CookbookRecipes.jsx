import React from 'react';
import Api from './../controller/Api.js';
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

    let recipeRows = [];

    if (recipes) {
      recipeRows = recipes.map((recipe, idx) => (
        <tr
          key={idx}
        >
          {recipe.link ?
            <td><a href={recipe.link} target="_blank">{recipe.name}</a></td>
            : <td>{recipe.name}</td>
          }
          <td>{recipe.page}</td>
          <td>{recipe.cook}</td>
        </tr>
      ));
    }

    return (
      <div>
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
                    <th className="recipe_list--title">Page</th>
                    <th className="recipe_list--title">Cook</th>
                  </tr>
                </thead>
                <tbody>
                  {recipeRows.length > 0 ?
                    recipeRows
                    : <tr><td colSpan="3">Get hungry!</td></tr>
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

export default CookbookRecipes;
