import React from 'react';
import { Formik, Field } from 'formik';
import { Button, Form, Row, Col } from 'react-bootstrap';

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
          {({ handleSubmit }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Row}>
                  <Col sm={1}><Form.Label htmlFor="isbn">ISBN:</Form.Label></Col>
                  <Field as="select" name="isbn" required>
                    { allBooks.map((book) => (
                      <option key={book._id} value={book._id}>{book._id}</option>
                    ))}
                  </Field>
                </Form.Group>
                <Col><Button variant="primary" type="submit">Rent</Button></Col>
              </Form>
            )}}
        </Formik>
      </>);
}
