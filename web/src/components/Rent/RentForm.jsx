import React from 'react';
import { Form, Formik, Field } from 'formik';
import { Button } from 'react-bootstrap';

export default function RentForm(props) {
  const { allBooks, rent } = props;

  return (
    allBooks.length === 0
    ? <div>
      There are no books to rent.  
    </div>
    : <>
        <h1>Rent a new book</h1>
        <Formik
          initialValues={{
            isbn: allBooks[0]._id,
          }}
          onSubmit={async (values) => { await rent(values) }}
        >
          <Form>
            <label htmlFor="isbn">ISBN:</label>{' '}
            <Field as="select" name="isbn" required>
              { allBooks.map((book) => (
                <option key={book._id} value={book._id}>{book._id}</option>
              ))}
            </Field>
            <br/>
            <Button variant="primary" type="submit">Rent</Button>
          </Form>
        </Formik>
      </>);
}
