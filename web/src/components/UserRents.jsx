import React from 'react';
import { findAllBooks, getRentsOfUser } from '../service/book';
import { Form, Formik } from 'formik';
import { Button } from 'react-bootstrap';

export default class UserRents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rents: [],
      allBooks: [],
      err: null,
    };
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

  render() {
    const { rents, allBooks, err } = this.state;

    const newRent = (
      <div>
        <h1>Rent a new book</h1>
        <Formik onSubmit={async (values) => { await this.rent(values) }}>
          <Form>
            <label htmlFor="isbn">ISBN:</label>{' '}
            <select id="isbn" name="isbn" required>
              { allBooks.map((book) => (
                <option key={book._id} value={book._id}>{book._id}</option>
              ))}
            </select>
            { err && <span className="red"></span> }
            <Button variant="primary" type="submit">Rent</Button>
          </Form>
        </Formik>
      </div>
    );

    const currentRents = (
      <div>
        <h1> Rented books</h1>
        {rents.length === 0
        ? <p>There are no books rented.</p>
        : <table>
            <thead>
              <tr>
                <th>ISBN</th>
                <th>date</th>
              </tr>
            </thead>
            <tbody>
              { rents.map((rent) => (
                  <tr key={`${rent.isbn}:${rent.date}`}>
                    <td>{rent.isbn}</td>
                    <td>{rent.date}</td>
                    <td>
                      <img src="/resources/return.png" alt="return" height="50"/>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    );

    return (
      <>
        {newRent}
        {currentRents}
      </>
    )
  }
}
