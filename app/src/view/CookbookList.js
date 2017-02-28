import React from 'react';
import Api from './../controller/Api.js';
import { Link } from 'react-router';

import AddCookbook from './AddCookbook';

class CookbookList extends React.Component {
  state = {
    cookbooks: []
  };

  componentDidMount() {
    Api.getCookbooks((books) => {
     this.setState({
       cookbooks: books,
     });
    });
  }

  render() {
    const { cookbooks } = this.state;

    let cookbookRows = [];

    if (cookbooks) {
      cookbookRows = cookbooks.map((book, idx) => (
        <tr
          key={idx}
        >
          <td><Link to={'/recipes/'+encodeURIComponent(book.author)+'/'+encodeURIComponent(book.title)}>{book.title}</Link></td>
          <td>{book.author}</td>
          <td><a href={book.blog} target="_blank">{book.blog}</a></td>
          <td>{book.displayDate}</td>
          <td><a href=""
            onClick={() => this.props.onBookClick(book)}>Edit</a></td>
        </tr>
      ));
    }

    return (
      <div>
        <table>
         <thead>
           <tr>
             <th>Title</th>
             <th>Author</th>
             <th>Blog</th>
             <th>Meeting Date</th>
             <th></th>
           </tr>
         </thead>
         <tbody>
           {cookbookRows}
         </tbody>
       </table>
       <AddCookbook />
     </div>
    );
  }
}

export default CookbookList;
