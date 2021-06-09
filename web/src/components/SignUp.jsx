import React from 'react';
import { Formik, Field, Form } from 'formik';
import { signup } from '../service/auth';
import { Button } from 'react-bootstrap';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }

  async signup(values) {
    try {
      const user = await signup(values);
      this.props.handleLogin(user);
    } catch (err) {
      this.setState({ err });
    }
  }

  render() {
    const { error } = this.state;
    return (
      <>
        <h1>Sign Up</h1>
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          onSubmit={async (values) => { await this.signup(values); }}
        >
          <Form>
            <label htmlFor="username">User name: </label>{' '}
            <Field type="text" id="username" name="username" placeholder="user name" required/>
            <br/>

            <label htmlFor="password">Password: </label>{' '}
            <input type="password" id="password" name="password" placeholder="password" required/>
            <br/>

            <Button variant="primary" type="submit">Sign Up</Button>
          </Form>
        </Formik>
        { error && <p className="red">{error}</p> }
      </>
    )
  }
}