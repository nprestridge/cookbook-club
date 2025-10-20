import { Link } from 'react-router';
import { Button } from 'reactstrap';
import React from 'react';

import Spinner from './Spinner';
import AddCookbook from './AddCookbook';
import Api from '../controller/Api';
import CookbookStore from '../controller/CookbookStore';

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
      CookbookStore.setCookbooks(books);
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
    const {
      canEdit, cookbooks, isLoading, currentBook, showModal,
    } = this.state;

    let cookbookTiles = [];

    if (cookbooks) {
      cookbookTiles = cookbooks.map(book => (
        <article className="flex-item cookbook-item" key={book.title}>
          <Link to={`/recipes/${book.slug}`}>
            {book.thumbnail
              ? <img className="cookbook-item__image lazyload" data-src={book.thumbnail} alt={book.title} />
              : (
                <img
                  className="cookbook-item__image"
                  src="/images/default_book_w400.jpg"
                  alt="{book.title}"
                />
              )
            }
          </Link>
          <div className="cookbook-item__title">
            <Link to={`/recipes/${book.slug}`}>{book.title}</Link>
          </div>
          <div className="cookbook-item__author">
            {book.author}
          </div>
          <div className="cookbook-item__date">
            {book.displayDate}
          </div>

          <div className="cookbook-item__actions">
            {book.amazon
              ? (
                <Link
                  to={book.amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action__icon action__icon--amazon"
                  aria-label="Go to Amazon"
                >
                  <i className="fab fa-amazon icon fa-sm fa-fw" aria-hidden="true" />
                </Link>
              )
              : null}
            {book.blog
              ? (
                <Link
                  to={book.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action__icon"
                  aria-label="Go to blog"
                >
                  <i className="fas fa-external-link-alt fa-sm fa-fw" aria-hidden="true" />
                </Link>
              )
              : null}
          </div>

          {canEdit
            ? (
              <div>
                <Button
                  bsStyle="info"
                  onClick={() => this.editCookbook(book)}
                  className="action-button"
                >
                  <img src="edit.svg" alt="Edit" className="action-button__icon" />
                </Button>
                {!book.displayDate
                  ? (
                    <Button
                      bsStyle="danger"
                      onClick={() => this.deleteCookbook(book)}
                      className="action-button"
                    >
                      <img src="trash.svg" alt="Delete" className="action-button__icon" />
                    </Button>
                  ) : null}
              </div>
            )
            : null}

        </article>
      ));
    }

    return (
      <div>
        {isLoading
          && <Spinner />
        }

        {canEdit
          && (
            <div className="add-button">
              <Button
                bsStyle="primary"
                onClick={() => this.addCookbook()}
              >
                Add Cookbook
              </Button>
            </div>
          )
        }

        <section className="flex flex--stretch">
          {cookbookTiles}
        </section>

        {canEdit
          /* Add Cookbook Modal */
          && (
            <AddCookbook
              book={currentBook}
              showModal={showModal}
              callback={this.refreshCookbookList}
            />
          )
        }
      </div>
    );
  }
}

export default CookbookList;
