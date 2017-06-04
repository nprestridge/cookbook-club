import { Link } from 'react-router';
import { Button } from 'react-bootstrap';
import React from 'react';

import AddCookbook from './AddCookbook';
import Api from './../controller/Api';

class CookbookList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cookbooks: [],
      showModal: false,
    };

    this.refreshCookbookList = this.refreshCookbookList.bind(this);
  }

  componentDidMount() {
    this.refreshCookbookList();
  }

  refreshCookbookList() {
    Api.getCookbooks((books) => {
      this.setState({
        cookbooks: books,
        showModal: false,
      });
    });
  }

  addCookbook() {
    this.setState({
      showModal: true,
      currentBook: null,
    });
  }

  editCookbook(book) {
    this.setState({
      showModal: true,
      currentBook: book,
    });
  }

  deleteCookbook(book) {
    // TODO - Add delete confirmation

    Api.deleteCookbook(book.title, book.author);
    this.refreshCookbookList();
  }

  render() {
    const { cookbooks } = this.state;
    let cookbookTiles = [];

    if (cookbooks) {
      cookbookTiles = cookbooks.map((book, idx) => (
        <article className="cookbook-item flex-item">
          <Link to={'/recipes/'+encodeURIComponent(book.author)+'/'+encodeURIComponent(book.title)}>{book.title}</Link>
          <br />
          {book.author}
          <br />
          <a href={book.blog} target="_blank">{book.blog}</a>
          <br />
          {book.displayDate}

          <br />
          <Button
            bsStyle="info"
            onClick={() => this.editCookbook(book)}
            className="button-action"
          >
            <img src="edit.svg" alt="Edit" className="button-action--icon" />
          </Button>
          {!book.displayDate ?
            <Button
              bsStyle="danger"
              onClick={() => this.deleteCookbook(book)}
              className="button-action"
            >
              <img src="trash.svg" alt="Delete" className="button-action--icon" />
            </Button> : ""}
        </article>
      ));
    }

    return (
      <div id="cookbook-list">
        <div className="button-section">
          <Button
            bsStyle="primary"
            onClick={() => this.addCookbook()}
          >
            Add Cookbook
          </Button>

        </div>

       <section className="container">
         <div className="flex">
           {cookbookTiles}
         </div>
       </section>

       <AddCookbook book={this.state.currentBook} showModal={this.state.showModal}
         callback={this.refreshCookbookList} />
     </div>
    );
  }
}

export default CookbookList;
