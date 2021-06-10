import React from 'react';
import autoBind from 'auto-bind';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
// import { registerBook } from '../../service/book';
import { Form, Row, Col } from 'react-bootstrap';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
    autoBind(this);
      
    this.RegisterSchema = Yup.object().shape({
      isbn: Yup.string()
        .matches(/[0-9]+/,'Must be a number')
        .min(13, 'Too Short!')
        .max(13, 'Too Long!')
        .required('Required'),
      title: Yup.string()
        .min(2, 'Too Short!')
        .max(30, 'Too Long!')
        .required('Required'),
      author: Yup.string()
        .min(2, 'Too Short!')
        .max(30, 'Too Long!')
        .required('Required'),
      summary: Yup.string()
        .max(100, 'Too long!'),
      copies: Yup.number()
        .integer('Must be integer')
        .positive('Must be positive'),
    });
  }

  async register(values) {
    try {
      console.log(values);
      // await registerBook(values);
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
          validationSchema={this.RegisterSchema}
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