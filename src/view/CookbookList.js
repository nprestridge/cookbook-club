import { Link } from 'react-router';
import { Button } from 'react-bootstrap';
import React from 'react';

import Spinner from './Spinner';
import AddCookbook from './AddCookbook';
import Api from './../controller/Api';

class CookbookList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      cookbooks: [],
      showModal: false,
      canEdit: false, // TODO - Add logic to manage bookbooks
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
        isLoading: false,
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
    const { canEdit, cookbooks } = this.state;

    let cookbookTiles = [];

    if (cookbooks) {
      cookbookTiles = cookbooks.map((book, idx) => (
        <article className="flex-item cookbook_item">
          <Link to={'/recipes/'+encodeURIComponent(book.author)+'/'+encodeURIComponent(book.title)}>
            {book.thumbnail ?
              <img className="cookbook_item--image" src={book.thumbnail} alt={book.title} />
            : <img className="cookbook_item--image" src="/images/default_book.jpg" alt="{book.title}" />
            }
          </Link>
          <div className="cookbook_item--title">
            <Link to={'/recipes/'+encodeURIComponent(book.author)+'/'+encodeURIComponent(book.title)}>{book.title}</Link>
          </div>
          <div className="cookbook_item--author">
            {book.author}
          </div>
          <div className="cookbook_item--date">
            {book.displayDate}
          </div>

          <div className="cookbook_item--actions">
            {book.amazon ?
              <Link
                to={book.amazon} target="_blank" rel="noopener noreferrer"
                className="action--icon action--icon-amazon"
              >
                <i className="fab fa-amazon icon fa-sm fa-fw" />
              </Link>
              : null}
            {book.blog ?
              <Link
                to={book.blog} target="_blank" rel="noopener noreferrer"
                className="action--icon"
              >
                <i className="fas fa-external-link-alt fa-sm fa-fw" />
              </Link>
              : null}
          </div>

          {canEdit ?
            <div>
              <Button
                bsStyle="info"
                onClick={() => this.editCookbook(book)}
                className="button--action"
              >
                <img src="edit.svg" alt="Edit" className="button--action--icon" />
              </Button>
              {!book.displayDate ?
                <Button
                  bsStyle="danger"
                  onClick={() => this.deleteCookbook(book)}
                  className="button--action"
                >
                  <img src="trash.svg" alt="Delete" className="button--action--icon" />
                </Button> : null}
            </div>
            : null}

        </article>
      ));
    }

    return (
      <div >
        {this.state.isLoading &&
          <Spinner />
        }

        {this.state.canEdit &&
          <div className="button_add">
            <Button
              bsStyle="primary"
              onClick={() => this.addCookbook()}
            >
              Add Cookbook
            </Button>
          </div>
        }

        <section className="flex flex--stretch">
          {cookbookTiles}
        </section>

        {this.state.canEdit &&
          /* Add Cookbook Modal */
          <AddCookbook
            book={this.state.currentBook}
            showModal={this.state.showModal}
            callback={this.refreshCookbookList}
          />
        }
      </div>
    );
  }
}

export default CookbookList;
