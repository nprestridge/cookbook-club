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
      canEdit: false,  // TODO - Add logic to manage bookbooks
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
    const { canEdit } = this.state;
    const { cookbooks } = this.state;

    let addCookbookButton;
    let cookbookTiles = [];

    if (canEdit) {
      addCookbookButton = (
        <div className="button-section">
          <Button
            bsStyle="primary"
            onClick={() => this.addCookbook()}
          >
            Add Cookbook
          </Button>
        </div>
      );
    }

    if (cookbooks) {
      cookbookTiles = cookbooks.map((book, idx) => (
        <article className="cookbook-item flex-item">
          <Link to={'/recipes/'+encodeURIComponent(book.author)+'/'+encodeURIComponent(book.title)}>
            <img className="cookbook-item__img" src="https://source.unsplash.com/800x600/?food" alt="{book.title}" />
          </Link>
          <div className="cookbook-item__title">
            <Link to={'/recipes/'+encodeURIComponent(book.author)+'/'+encodeURIComponent(book.title)}>{book.title}</Link>
          </div>
          <div className="cookbook-item__author">
            {book.author}
          </div>
          <div className="cookbook-item__date">
            {book.displayDate}
          </div>

          <div className="cookbook-item__actions">
            {book.blog ?
              <Link to={book.blog} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-link"></i>
              </Link>
            : null}
          </div>

          {canEdit ?
            <div>
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
                </Button> : null}
            </div>
          : null}

        </article>
      ));
    }

    return (
      <div id="cookbook-list">
        {addCookbookButton}

        <section className="container">
          <div className="flex">
            {cookbookTiles}
          </div>
        </section>

       {/* Add Cookbook Modal */}
       <AddCookbook book={this.state.currentBook} showModal={this.state.showModal}
         callback={this.refreshCookbookList} />
     </div>
    );
  }
}

export default CookbookList;
