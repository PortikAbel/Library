import React from 'react';
import autoBind from 'auto-bind';
import { findAllBooks } from '../../service/book';
import RentForm from './RentForm';
import ActiveRents from './ActiveRents';
import { rentBook, returnBook, getRentsOfUser } from '../../service/rent';

export default class UserRents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rents: [],
      allBooks: [],
      err: null,
    };
    autoBind(this);
  }

  async componentDidMount() {
    try {
      const allBooks = await findAllBooks();
      this.setState({ allBooks });
      const rents = await getRentsOfUser();
      this.setState({ rents });
    } catch (err) {
      this.setState({ err });
    }
  }

  async rent(values) {
    const rent = await rentBook(values);
    let rents = [...this.state.rents];
    rents.push(rent);
    this.setState({ rents });
  }

  async return(rent) {
    try {
      await returnBook(rent);
      const rents = this.state.rents.filter((oldRent) => oldRent != rent);
      this.setState({ rents });
    } catch (err) {
      this.setState({ err });
    }
  }

  render() {
    const { rents, allBooks, err } = this.state;
    return (
      <>
        {err && <p className='red'>{err}</p>}
        <RentForm allBooks={allBooks} rent={this.rent} />
        <ActiveRents rents={rents} returnBook={this.return} />
      </>
    )
  }
}
