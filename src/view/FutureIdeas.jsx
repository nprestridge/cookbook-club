import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Spinner from './Spinner';
import Api from '../controller/Api';
import CookbookStore from '../controller/CookbookStore';

function FutureIdeas() {
  const [isLoading, setIsLoading] = useState(true);
  const [ideas, setIdeas] = useState([]);

  const refreshIdeas = () => {
    Api.getFutureIdeas((books) => {
      // Only include items that are drafts (server may include state)
      const drafts = (books || []).filter((b) => (b.state || '').toLowerCase() === 'draft');
      CookbookStore.setCookbooks(books);
      setIdeas(drafts);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    refreshIdeas();
  }, []);

  let tiles = [];
  if (ideas) {
    tiles = ideas.map((book) => (
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
            )}
        </Link>
        <div className="cookbook-item__title">
          <Link to={`/recipes/${book.slug}`}>{book.title}</Link>
        </div>
        <div className="cookbook-item__author">
          {book.author}
        </div>
        <div className="cookbook-item__date">
          {book.displayDate || 'TBD'}
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

      </article>
    ));
  }

  return (
    <div>
      {isLoading && <Spinner />}

      <section className="flex flex--stretch">
        {tiles}
      </section>
    </div>
  );
}

export default FutureIdeas;
