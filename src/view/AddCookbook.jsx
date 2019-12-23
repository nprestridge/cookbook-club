import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'reactstrap';

import Api from '../controller/Api';

class AddCookbook extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      title: '',
      author: '',
      date: '',
      blog: '',
      action: 'Add',
      showModal: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.postUpdate = this.postUpdate.bind(this);
  }

  componentDidMount() {
    const { callback } = this.props;
    if (callback) {
      this.parentCallback = callback.bind(this);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { showModal } = this.props;
    const { book } = nextProps;

    if (showModal !== nextProps.showModal) {
      this.setState({
        showModal: nextProps.showModal,
      });
    }

    if (nextProps.book) {
      this.setState({
        title: book.title,
        author: book.author,
        date: book.isoDate,
        blog: book.blog,
        action: 'Update',
      });
    } else {
      this.setState({
        title: '',
        author: '',
        date: '',
        blog: '',
        action: 'Add',
      });
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const validationErrors = [];

    const {
      title, author, blog, date,
    } = this.state;

    if (!title) {
      validationErrors.push('Title is required');
    }

    if (!author) {
      validationErrors.push('Author is required');
    }

    // Return any validation errors
    if (validationErrors.length > 0) {
      this.setState({
        error: validationErrors,
      });
      return;
    }

    // Update cookbook
    Api.updateCookbook(title, author, blog, date, this.postUpdate);
  }

  postUpdate() {
    this.parentCallback();
    this.closeModal();
  }

  closeModal() {
    this.setState({
      error: null,
      showModal: false,
    });
  }

  renderError() {
    const { error } = this.state;
    if (!error) { return null; }

    const errorList = error.map(e => (
      <div key={e}>{e}</div>
    ));

    return (
      <div style={{ color: 'red' }}>
      Please fix the following errors:
        {errorList}
      </div>
    );
  }

  render() {
    const {
      showModal, action, title, author, blog, date,
    } = this.state;

    return (
      // TODO: Revisit modal
      // eslint-disable-next-line react/jsx-no-bind
      <Modal show={showModal} onHide={this.closeModal.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {action}
            Cookbook
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="add-cookbook" className="cookbook-form" onSubmit={this.handleSubmit}>
            {this.renderError()}
            <div>
              Cookbook Title:
              {action === 'Add'
                ? (
                  <input
                    name="title"
                    type="text"
                    value={title}
                    onChange={this.handleInputChange}
                  />
                )
                : <span>{title}</span>
              }
            </div>
            <div>
              Author:
              {action === 'Add'
                ? (
                  <input
                    name="author"
                    type="text"
                    value={author}
                    onChange={this.handleInputChange}
                  />
                )
                : <span>{author}</span>
              }
            </div>
            <div>
              Blog:
              <input
                name="blog"
                type="text"
                value={blog}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              Meeting Date:
              <input
                name="date"
                type="text"
                value={date}
                onChange={this.handleInputChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit}>
            {action}
            Cookbook
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

AddCookbook.propTypes = {
  book: PropTypes.objectOf(PropTypes.string),
  showModal: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
};

AddCookbook.defaultProps = {
  book: {},
};

export default AddCookbook;
