import React from 'react';
import Api from './../controller/Api.js';
import { Link } from 'react-router';

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
      <div className="App">
        <div className="App-header">
          <h2><em>{book}</em> by {author}</h2>
        </div>
        <div>
          <table>
           <thead>
             <tr>
               <th>Recipe</th>
               <th>Page</th>
               <th>Brought by</th>
             </tr>
           </thead>
           <tbody>
             {recipeRows.length > 0 ?
               recipeRows
               : <tr><td colSpan='3'>Add recipes!</td></tr>
             }
           </tbody>
         </table>
          <p><Link to={`/`}>Cookbook Club Meetings</Link></p>
        </div>
      </div>
    );
  }
}

export default CookbookRecipes;
