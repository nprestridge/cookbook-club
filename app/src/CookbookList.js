import React from 'react';
import Client from './Client';

class CookbookList extends React.Component {
  state = {
    cookbooks: []
  };

  componentDidMount() {
    Client.getCookbooks((books) => {
     this.setState({
       cookbooks: books,
     });
    });
  }

  render() {
    const { cookbooks } = this.state;

    let cookbookRows = [];

    if (cookbooks) {
      cookbookRows = cookbooks.map((book, idx) => (
        <tr
          key={idx}
        >
          <td>{book.title}</td>
          <td>{book.author}</td>
          <td><a href="{book.blog}" target="_blank">{book.blog}</a></td>
          <td>{book.displayDate}</td>
          <td><a href=""
            onClick={() => this.props.onBookClick(book)}>Edit</a></td>
        </tr>
      ));
    }

    return (
      <table>
       <thead>
         <tr>
           <th>Title</th>
           <th>Author</th>
           <th>Blog</th>
           <th>Meeting Date</th>
           <th></th>
         </tr>
       </thead>
       <tbody>
         {cookbookRows}
       </tbody>
     </table>
    );
  }
}

export default CookbookList;
