import React from 'react';
import { Link } from 'react-router-dom';
import { apiServerUrl, getSummary } from '../service/book.js';

export default class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showSummary: false };

    this.clickSummary = this.clickSummary.bind(this);
  }

  async clickSummary() {
    const { showSummary } = this.state;
    if (!showSummary) {
      const summary = await getSummary(this.props.book._id);
      this.setState({ summary });
    }
    this.setState({ showSummary: !showSummary });
  }
  
  render() {
    const { book, user, deleteBook, index } = this.props;

    return (
      <>
        <tr>
          { user
          ? <td><Link to={`/books/${book._id}/rents`} className="id">{book._id}</Link></td>
          : <td>{book._id}</td>
          }
          <td onClick={this.clickSummary}>{book.title}</td>
          <td>{book.author}</td>
          <td>{book.releasedate}</td>
          <td>{book.copies}</td>
          <td>
            <img 
              src={`${apiServerUrl}/${book.imageName}`}
              alt={book.imageName}
              height="100"
            />
          </td>
          { user && user.admin &&
              <td>
                <img src="/resources/delete.png" alt="delete" height="50"
                onClick={() => deleteBook(index)}/>
              </td>
          }
        </tr>
        { this.state.showSummary &&
          <tr>
            <td className="summary" colSpan="6">{this.state.summary}</td>
          </tr>
        }
      </>
    );
  }
}
