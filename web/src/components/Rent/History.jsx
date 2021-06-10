import React from 'react';
import { getHistoryOfUser } from '../../service/rent';

export default class ActiveRents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rents: [],
    }
  }

  async componentDidMount() {
    try {
      const rents = await getHistoryOfUser();
      this.setState({ rents });
    } catch (err) {
      this.setState({ err });
    }
  }

  render() {
    const { rents } = this.state;

    return (
      <>
        <h1>Returned books</h1>
        {
          rents.length === 0
            ? <p>There are no books returned.</p>
            : <table>
              <thead>
                <tr>
                  <th>ISBN</th>
                  <th>Date of rent</th>
                  <th>Time of rent</th>
                  <th>Date of return</th>
                  <th>Time of return</th>
                </tr>
              </thead>
              <tbody>
                {rents.map((rent) => (
                  <tr key={`${rent.renter}${rent.rentDate}`}>
                    <td>{rent.isbn}</td>
                    <td>{rent.rentDate.slice(0, 10)}</td>
                    <td>{rent.rentDate.slice(11, 19)}</td>
                    <td>{rent.returnDate.slice(0, 10)}</td>
                    <td>{rent.returnDate.slice(11, 19)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </>
    );
  }
}
