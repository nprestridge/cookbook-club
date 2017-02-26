import React from 'react';
import Api from './../controller/Api.js';
import { Link } from 'react-router';

class CookbookRecipes extends React.Component {
  state = {
    recipes: []
  };

  componentDidMount() {
    const params = this.props.params;
    Api.getCookbookRecipes(encodeURIComponent(params.author), encodeURIComponent(params.book), (recipes) => {
     this.setState({
       recipes: recipes,
     });
    });
  }

  render() {
    const { recipes } = this.state;

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
       <p><Link to={`/cookbooks`}>Cookbook Club Meetings</Link></p>
     </div>
    );
  }
}

export default CookbookRecipes;
