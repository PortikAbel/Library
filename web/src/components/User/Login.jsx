import React from 'react';
import autoBind from 'auto-bind';
import { Formik, Field, Form } from 'formik';
import { login } from '../../service/auth';
import { Button } from 'react-bootstrap';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
    autoBind(this);
  }

  async login(values) {
    try {
      const user = await login(values);
      this.props.handleLogin(user);
      this.props.history.push('/');
    } catch (err) {
      this.setState({ err });
    }
  }

  render() {
    const { error } = this.state;
    return (
      <>
        <h1>Login</h1>
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          onSubmit={async (values) => { await this.login(values); }}
        >
          {({ handleSubmit }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <label htmlFor="username">User name:</label>{' '}
                <Field type="text" id="username" name="username" placeholder="user name" required/>
                <br/>

                <label htmlFor="password">Password:</label>{' '}
                <input type="password" id="password" name="password" placeholder="password" required/>
                <br/>

                <Button variant="primary" type="submit">Login</Button>
              </Form>
            )}}
        </Formik>
        { error && <p className="red">{error}</p> }
      </>
    )
  }
}