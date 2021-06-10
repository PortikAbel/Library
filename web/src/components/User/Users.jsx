import React from 'react';
import autoBind from 'auto-bind';
import { Formik, Field } from 'formik';
import { Form, Row, Col } from 'react-bootstrap';
import { getAllUsers, updateUser } from '../../service/users';
import { Table } from 'react-bootstrap';
import User from './User';

export default class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filters: {
        showAdmin: true,
        showUser: true,
      },
    }
    autoBind(this);
  }

  async componentDidMount() {
    const users = await getAllUsers();
    this.setState({ users });
  }

  changeFilters(values) {
    let filters = {...this.state.filters};
    for (const filterKey in values) {
      filters[filterKey] = values[filterKey]
        ? values[filterKey]
        : null;
    }
    this.setState({ filters })
  }

  async changeAdmin(user) {
    const updateAdmin = { admin: !user.admin };
    let users = [...this.state.users];
    const userIndex = users.findIndex(userInArray => userInArray === user);
    const newUser = await updateUser(user, updateAdmin);
    users[userIndex] = newUser;
    this.setState({ users });
  }

  getFilteredUsers() {
    const { filters } = this.state;
    let users = [];

    if (filters.showAdmin || filters.showUser) {
      users = this.state.users;
 
      if (filters.showUser) {
        if (!filters.showAdmin) {
          users = users.filter(user => !user.admin);
        }
      } else {
        users = users.filter(user => user.admin);
      }
      if (filters._id) {
        users = users.filter(user => user._id === filters._id)
      }
    }
    return users;
  }

  render() {
    const users = this.getFilteredUsers();

    const searchForm = (
      <Formik
      initialValues= {{
        _id: null,
        showAdmin: true,
        showUser: true,
      }}

      onSubmit={(values) => this.changeFilters(values)}
    >
      {({ handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row}>
              <Col sm={1}><Form.Label>username: </Form.Label></Col>
              <Col><Field type="text" name="_id"/></Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col sm={1}><Form.Label>show admins: </Form.Label></Col>
              <Col><Field type="checkbox" name="showAdmin"/></Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col sm={1}><Form.Label>show users: </Form.Label></Col>
              <Col><Field type="checkbox" name="showUser"/></Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col>
              <button type="submit" className="btn btn-primary">Search</button>
              </Col>
            </Form.Group>
          </Form>
        )}}
      </Formik>
    )

    const usersTable = (
      <Table>
        <thead>
          <th>Username</th>
          <th>Is admin</th>
        </thead>
        <tbody>
          {users.map((user) => (
            <User key={user._id} user={user} changeAdmin={this.changeAdmin} />
          ))}
        </tbody>
      </Table>
    )

    return (
      <>
        {searchForm}
        {usersTable}
      </>
    );
  }
}