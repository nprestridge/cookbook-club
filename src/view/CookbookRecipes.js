import React from 'react';
import Api from './../controller/Api.js';
import { Link } from 'react-router';

import './Recipe.css';

class CookbookRecipes extends React.Component {
  state = {
    recipes: []
  };

  componentDidMount() {
    const book = this.props.params.book;
    const author = this.props.params.author;

    Api.getCookbookRecipes(encodeURIComponent(author), encodeURIComponent(book), (recipes) => {
     this.setState({
       book: book,
       author: author,
       recipes: recipes,
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
        <h1 className="recipe-list__heading"><em>{book}</em> by {author}</h1>
        <div className="recipe-list">
          <table>
           <thead>
             <tr>
               <th className="recipe-list__header">Recipe</th>
               <th className="recipe-list__header">Page</th>
               <th className="recipe-list__header">Cook</th>
             </tr>
           </thead>
           <tbody>
             {recipeRows.length > 0 ?
               recipeRows
               : <tr><td colSpan='3'>Get hungry!</td></tr>
             }
           </tbody>
         </table>
        </div>
      </div>
    );
  }
}

export default CookbookRecipes;
