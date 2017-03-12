import React from 'react';
import Api from './../controller/Api.js';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import AddCookbook from './AddCookbook';

class CookbookList extends React.Component {
  state = {
    cookbooks: [],
    showModal: false
  };

  componentDidMount() {
    this.refreshCookbookList();
  }

  refreshCookbookList() {
    Api.getCookbooks((books) => {
     this.setState({
       cookbooks: books,
     });
    });
  }

  addCookbook() {
    this.setState({
      showModal: true
    });
  }

  editCookbook(book) {
    this.setState({
      showModal: true,
      currentBook: book
    });
  }

  deleteCookbook(book) {
    // TODO - Add delete confirmation
    console.log("DELETE: ", book);
    Api.deleteCookbook(book.title, book.author);
    this.refreshCookbookList();
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
          <td>
            <Button
              bsStyle="info"
              onClick={() => this.editCookbook(book)}
            >
              Edit
            </Button>
          </td>
          <td>{!book.displayDate ?
              <Button
                bsStyle="danger"
                onClick={() => this.deleteCookbook(book)}
              >
                X
              </Button> : ""}
          </td>
        </tr>
      ));
    }

    return (
      <div>
        <div className="button-section">
          <Button
            bsStyle="primary"
            onClick={() => this.addCookbook()}
          >
            Add Cookbook
          </Button>

        </div>
        <table>
         <thead>
           <tr>
             <th>Title</th>
             <th>Author</th>
             <th>Blog</th>
             <th>Meeting Date</th>
             <th></th>
             <th></th>
           </tr>
         </thead>
         <tbody>
           {cookbookRows}
         </tbody>
       </table>

       <AddCookbook book={this.state.currentBook} showModal={this.state.showModal} />
     </div>
    );
  }
}

export default CookbookList;
