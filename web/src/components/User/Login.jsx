import React from 'react';
import autoBind from 'auto-bind';
import { Formik, Field } from 'formik';
import { Form, Row, Col } from 'react-bootstrap';
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
    const { err } = this.state;
    return (
      <>
        <h1>Login</h1>
        <Formik
          initialValues={{
            _id: '',
            password: '',
          }}
          onSubmit={async (values) => { await this.login(values); }}
        >
          {({ handleSubmit }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Row}>
                  <Col sm={2}><Form.Label>User&nbsp;name: </Form.Label></Col>
                  <Col><Field type="text" name="_id" placeholder="username" /></Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Col sm={2}><Form.Label>Password: </Form.Label></Col>
                  <Col><Field type="password" name="password" placeholder="password" /></Col>
                </Form.Group>
                
                <Button variant="primary" type="submit">Login</Button>
              </Form>
            )}}
        </Formik>
        { err && <p className="red">{err}</p> }
      </>
    )
  }
}