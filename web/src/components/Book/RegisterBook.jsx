import React from 'react';
import autoBind from 'auto-bind';
import { Formik, Field } from 'formik';
import { registerBook } from '../../service/book';
import { Form, Row, Col } from 'react-bootstrap';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
    autoBind(this);
  }

  async register(values) {
    try {
      await registerBook(values);
      this.props.history.push('/');
    } catch (err) {
      this.setState({ err });
    }
  }

  render() {
    const { err } = this.state;
    return (
      <>
        <h1>Register new book</h1>
        <Formik
          initialValues={{
            isbn: '',
            title: '',
            author: '',
            releasedate: '',
            summary: '',
            copies: 0,
            cover: '',
          }}
          
          onSubmit={async (values) => { await this.register(values); }}
        >
          {({ handleSubmit, setFieldValue }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="isbn">ISBN:</Form.Label>
                  <Col><Field type="text" name="isbn" placeholder="isbn" required/></Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="title">Title:</Form.Label>
                  <Col><Field type="text" name="title" placeholder="title" required/></Col>
                </Form.Group>
                  
                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="author">Author:</Form.Label>
                  <Col><Field type="text" name="author" placeholder="author" required/></Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="releasedate">Release date:</Form.Label>
                  <Col><Field type="date" name="releasedate" required/></Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="summary">Summary:</Form.Label>
                  <Col><Field type="text" name="summary" placeholder="summary" required/></Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="copies">No copyes:</Form.Label>
                  <Col><Field type="number" name="copies" required/></Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="cover">Cover photo</Form.Label>
                  <Col><input name="cover" type="file" required onChange={(event) =>
                      setFieldValue('cover', event.currentTarget.files[0])
                    }
                  /></Col>
                </Form.Group>
                
                <button type="submit" className="btn btn-primary">Register</button>
              </form>
            );
          }}
        </Formik>
        { err && <p className="red">{err}</p> }
      </>
    )
  }
}