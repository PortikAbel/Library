import React from 'react';
import autoBind from 'auto-bind';
import { Formik, Field } from 'formik';
import { registerBook } from '../../service/book';
import { Form, Row, Col } from 'react-bootstrap';
import RegisterScheme from '../../schemes/RegisterScheme';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
    autoBind(this);
  }

  async register(values) {
    try {
      console.log(values);
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
          validationSchema={RegisterScheme}
          onSubmit={async (values) => { await this.register(values); }}
        >
          {({ handleSubmit, setFieldValue, errors }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="isbn">ISBN:</Form.Label>
                  <Col><Field type="text" name="isbn" placeholder="isbn"/></Col>
                  { errors.isbn && <Col className='red'>{ errors.isbn }</Col>}
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="title">Title:</Form.Label>
                  <Col><Field type="text" name="title" placeholder="title"/></Col>
                  { errors.title && <Col className='red'>{ errors.title }</Col>}
                </Form.Group>
                  
                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="author">Author:</Form.Label>
                  <Col><Field type="text" name="author" placeholder="author"/></Col>
                  { errors.author && <Col className='red'>{ errors.author }</Col>}
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="releasedate">Release date:</Form.Label>
                  <Col><Field type="date" name="releasedate"/></Col>
                  { errors.releasedate && <Col className='red'>{ errors.releasedate }</Col>}
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="summary">Summary:</Form.Label>
                  <Col><Field type="text" name="summary" placeholder="summary"/></Col>
                  { errors.summary && <Col className='red'>{ errors.summary }</Col>}
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="copies">No copyes:</Form.Label>
                  <Col><Field type="number" name="copies"/></Col>
                  { errors.copies && <Col className='red'>{ errors.copies }</Col>}
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={2} htmlFor="cover">Cover photo</Form.Label>
                  <Col><input name="cover" type="file" required onChange={(event) =>
                      setFieldValue('cover', event.currentTarget.files[0])
                    }
                  /></Col>
                </Form.Group>
                
                <button type="submit" className="btn btn-primary">Register</button>
              </Form>
            );
          }}
        </Formik>
        { err && <p className="red">{err}</p> }
      </>
    )
  }
}