import React from 'react';
import autoBind from 'auto-bind';
import { deleteBook, findAllBooks } from '../../service/book.js';
import Book from './Book';

export default class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
    };
    autoBind(this);
  }

  async componentDidMount() {
    const books = await findAllBooks();
    this.setState({ books });
  }

  async deleteBook(index) {
    let books = [...this.state.books];
    await deleteBook(books[index]._id)
    books.splice(index, 1);
    this.setState({ books });
  }

  render() {
    const { books } = this.state;
    const { user } = this.props;

    if (books.length === 0) {
      return (<div>No books to show.</div>);
    }

    return (
      <table>
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Title (click for summary)</th>
            <th>Author</th>
            <th>Release date</th>
            <th>Number of copies</th>
            <th>Cover</th>
          </tr>
        </thead>
        <tbody id="container">
          {books.map((book, i) => (
            <Book
              key={book._id}
              book={book}
              user={user}
              deleteBook={this.deleteBook}
              index={i}
            />
          ))}
        </tbody>
      </table>
    );
  }
}
