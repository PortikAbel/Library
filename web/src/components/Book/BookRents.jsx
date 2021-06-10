import React from 'react';
import { getRentsOfBook } from '../../service/rent';

export default class BookRents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rents: [],
      err: null,
    };
  }

  async componentDidMount() {
    try {
      const rents = await getRentsOfBook(this.props.match.params.isbn);
      this.setState({ rents });
    } catch (err) {
      this.setState({ err });
    }
  }

  render() {
    const { rents, err } = this.state;
    const { isbn } = this.props.match.params;

    if (err) {
      return (<div className='red'>{err}</div>);
    }

    if (rents.length === 0) {
      return (
        <p>No one rented the book with ISBN { isbn }.</p>
      );
    }
    return (
      <>
        <h1>Users who rented book with ISBN { isbn }:</h1>
        <ul>
          { rents.map((rent) => (
            <li key={`${rent.renter}:${rent.rentDate}`}>{ rent.renter }</li>
          ))}
        </ul>
      </>
    );
  }
}
