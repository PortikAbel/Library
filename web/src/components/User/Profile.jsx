import React from 'react';
import autoBind from 'auto-bind';
import { Formik, Field } from 'formik';
import { Form, Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { changePassword, changeUsername } from '../../service/users';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
    autoBind(this);
  }

  async changeUsername(values) {
    try {
      const user = await changeUsername(values);
      this.props.handleLogin(user);
    } catch (err) {
      this.setState({ err });
    }
  }

  async changePassword(values) {
    try {
      const user = await changePassword(values);
      this.props.handleLogin(user);
    } catch (err) {
      this.setState({ err });
    }
  }

  render() {
    const { error } = this.state;
    return (
      <>
        <h1>Change Username</h1>
        <Formik
          initialValues={{
            _id: '',
            password: '',
          }}
          onSubmit={async (values) => { await this.changeUsername(values); }}
        >
          {({ handleSubmit }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Row}>
                  <Col sm={2}><Form.Label>New&nbsp;user&nbsp;name: </Form.Label></Col>
                  <Col><Field type="text" name="_id" placeholder="new username" /></Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Col sm={2}><Form.Label>Password: </Form.Label></Col>
                  <Col><Field type="password" name="password" placeholder="your current password" /></Col>
                </Form.Group>

                <Button variant="primary" type="submit">Change</Button>
              </Form>
            )}}
        </Formik>
        <h1>Change Password</h1>
        <Formik
          initialValues={{
            password: '',
            newPassword: '',
          }}
          onSubmit={async (values) => { await this.changePassword(values); }}
        >
          {({ handleSubmit }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Row}>
                  <Col sm={2}><Form.Label>Password: </Form.Label></Col>
                  <Col><Field type="password" name="password" placeholder="your current password" /></Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Col sm={2}><Form.Label>New&nbsp;password: </Form.Label></Col>
                  <Col><Field type="password" name="newPassword" placeholder="new password" /></Col>
                </Form.Group>

                <Button variant="primary" type="submit">Change</Button>
              </Form>
            )}}
        </Formik>
        { error && <p className="red">{error}</p>}
      </>
    )
  }
}