import React from 'react';
import Api from './../controller/Api.js';

class AddCookbook extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      title: "",
      author: "",
      date: "",
      blog: "",
      action: "Add"
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.book) {
      const book = this.props.book;
      this.setState({
        title: book.title,
        author: book.author,
        date: book.isoDate,
        blog: book.blog,
        action: "Update"
      });
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    let validationErrors = [];

    const title = this.state.title;
    const author = this.state.author;
    const blog = this.state.blog;
    const date = this.state.date;

    if (!title) {
      validationErrors.push("Title is required");
    }

    if (!author) {
      validationErrors.push("Author is required");
    }

    if (validationErrors.length > 0) {
      this.setState({
        error: validationErrors
      });
      return;
    }

    // Update cookbook
    Api.updateCookbook(title, author, blog, date);

    // TODO - Close modal, Refresh cookbook list

    // TODO - Reset form, error state
    this.setState({
      title: "",
      author: "",
      date: "",
      blog: "",
      error: ""
    });

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      <form id="add-cookbook" className="cookbook-form" onSubmit={this.handleSubmit}>
        {this.renderError()}
        <div>
          Cookbook Title: <input name="title" type="text" value={this.state.title} onChange={this.handleInputChange} />
        </div>
        <div>
          Author: <input name="author" type="text" value={this.state.author} onChange={this.handleInputChange}  />
        </div>
        <div>
          Blog: <input name="blog" type="text" value={this.state.blog} onChange={this.handleInputChange}  />
        </div>
        <div>
          Meeting Date: <input name="date" type="text" value={this.state.date} onChange={this.handleInputChange}  />
        </div>
        <button type="submit">{this.state.action} Cookbook</button>
      </form>
    )
  }
}

export default AddCookbook;
