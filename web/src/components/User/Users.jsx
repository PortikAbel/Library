import React from 'react';
import autoBind from 'auto-bind';
import { getAllUsers, updateUser } from '../../service/users';
import { Table } from 'react-bootstrap';
import User from './User';

export default class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filters: {},
    }
    autoBind(this);
  }

  async componentDidMount() {
    const users = await getAllUsers();
    this.setState({ users });
  }

  changeFilters(values) {
    console.log(values);
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

  render() {
    const { users } = this.state;

    return (
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
  }
}