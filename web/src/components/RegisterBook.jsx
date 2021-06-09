import React from 'react';
import autoBind from 'auto-bind';
import { Formik, Field } from 'formik';
import { registerBook } from '../service/book';

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
    const { error } = this.state;
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
                <label htmlFor="isbn">ISBN:</label>{' '}
                <Field type="text" name="isbn" placeholder="isbn" required/>
                <br/>

                <label htmlFor="title">Title:</label>{' '}
                <Field type="text" name="title" placeholder="title" required/>
                <br/>
                
                <label htmlFor="author">Author:</label>{' '}
                <Field type="text" name="author" placeholder="author" required/>
                <br/>

                <label htmlFor="releasedate">Release date:</label>{' '}
                <Field type="date" name="releasedate" required/>
                <br/>

                <label htmlFor="summary">Summary:</label>{' '}
                <Field type="text" name="summary" placeholder="summary" required/>
                <br/>

                <label htmlFor="copies">No copyes:</label>{' '}
                <Field type="number" name="copies" required/>
                <br/>

                <label htmlFor="cover">Cover photo</label>{' '}
                <input name="cover" type="file" required onChange={(event) =>
                    setFieldValue('cover', event.currentTarget.files[0])
                  }
                />
                <br/>
                
                <button type="submit" className="btn btn-primary">Register</button>
              </form>
            );
          }}
        </Formik>
        { error && <p className="red">{error}</p> }
      </>
    )
  }
}