import React from 'react';
import Api from './../controller/Api.js';

class AddCookbook extends React.Component {

  state = {
    error: null
  }

  // handleChange(event) {
  //   this.setState({title: event.target.value});
  // }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    let validationErrors = [];

    const title = event.target.title.value;
    const author = event.target.author.value;
    const blog = event.target.blog.value;
    const date = event.target.date.value;

    if (!title) {
      validationErrors.push("Title is required");
    }

    if (!author) {
      validationErrors.push("Author is required");
    }

    if (validationErrors.length > 0) {
      // TODO: Display validation errors
      console.log("Errors: ", validationErrors);
      // this.setState({
      //   error: "There's an error :-( )"
      // });
      return;
    }

    // Update cookbook
    // console.log("Title: ", title , " Author: ", author);
    Api.updateCookbook(title, author, blog, date);

    // TODO - Refresh cookbook list
    // TODO - Reset form, error state
  }

  renderError() {
    if (!this.state.error) { return null; }

    return <div style={{ color: 'red' }}>Error: {this.state.error}</div>;
  }

  render() {
    const { errors } = this.state;
    return (
      <form id="add-cookbook" className="cookbook-form" onSubmit={this.handleSubmit}>
        {this.renderError()}
        <div>
          Cookbook Title: <input name="title" type="text" />
        </div>
        <div>
          Author: <input name="author" type="text" />
        </div>
        <div>
          Blog: <input name="blog" type="text" />
        </div>
        <div>
          Meeting Date: <input name="date" type="text" />
        </div>
        <button type="submit">Add Cookbook</button>
      </form>
    )
  }
}

export default AddCookbook;
