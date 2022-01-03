import React from 'react';
import { Table } from 'react-bootstrap';

export default function ActiveRents(props) {
  const { rents, returnBook } = props;

  return (
    <>
      <h1> Rented books</h1>
      {rents.length === 0
        ? <p>There are no books rented.</p>
        : <Table bordered>
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Date of rent</th>
                <th>Time of rent</th>
              </tr>
            </thead>
            <tbody>
              {rents.map((rent) => (
                <tr key={`${rent.renter}${rent.rentDate}`}>
                  <td>{rent.isbn}</td>
                  <td>{rent.rentDate.slice(0, 10)}</td>
                  <td>{rent.rentDate.slice(11, 19)}</td>
                  <td>
                    <img src="/resources/return.png" alt="return" className="icon"
                    onClick={() => returnBook(rent)}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
      }
    </>
  )
}
