import React from 'react';
import autoBind from 'auto-bind';
import { Formik, Field } from 'formik';
import { Form, Row, Col } from 'react-bootstrap';
import { signup } from '../../service/auth';
import { Button } from 'react-bootstrap';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
    autoBind(this);
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
            _id: '',
            password: '',
          }}
          onSubmit={async (values) => { await this.signup(values); }}
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
                
                <Button variant="primary" type="submit">Sign Up</Button>
              </Form>
          )}}
        </Formik>
        { error && <p className="red">{error}</p> }
      </>
    )
  }
}