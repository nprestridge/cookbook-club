import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import Api from './../controller/Api';

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
    if (this.props.callback) {
      this.parentCallback = this.props.callback.bind(this);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.showModal !== nextProps.showModal) {
      this.setState({
        showModal: nextProps.showModal,
      });
    }

    if (nextProps.book) {
      const book = nextProps.book;
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
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const validationErrors = [];

    const title = this.state.title;
    const author = this.state.author;
    const blog = this.state.blog;
    const date = this.state.date;

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
    if (!this.state.error) { return null; }

    const errorList = this.state.error.map((error, idx) => (
      <div key={idx}>{error}</div>
    ));

    return <div style={{ color: 'red' }}>Please fix the following errors: {errorList}</div>;
  }

  render() {
    return (
      <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.action} Cookbook</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="add-cookbook" className="cookbook-form" onSubmit={this.handleSubmit}>
            {this.renderError()}
            <div>
              Cookbook Title: {this.state.action === 'Add' ?
                <input
                  name="title" type="text" value={this.state.title}
                  onChange={this.handleInputChange}
                />
                  : <span>{this.state.title}</span>
                }
            </div>
            <div>
              Author: {this.state.action === 'Add' ?
                <input
                  name="author"
                  type="text"
                  value={this.state.author}
                  onChange={this.handleInputChange}
                />
                  : <span>{this.state.author}</span>
                }
            </div>
            <div>
              Blog:
                <input
                  name="blog"
                  type="text"
                  value={this.state.blog}
                  onChange={this.handleInputChange}
                />
            </div>
            <div>
              Meeting Date:
                <input
                  name="date"
                  type="text"
                  value={this.state.date}
                  onChange={this.handleInputChange}
                />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit}>{this.state.action} Cookbook</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddCookbook;
