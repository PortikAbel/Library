import React from 'react';
import autoBind from 'auto-bind';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { logout } from '../service/auth';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  async onLogout() {
    await logout();
    this.props.handleLogout();
    this.props.history.push('/');
  }

  render() {
    const { user } = this.props;

    return (
      <nav>
        <Button variant="link"><Link to="/">Home</Link></Button>
        { user
          ? <>
            {user.admin && <Button variant="link"><Link to="/books/register">Register new book</Link></Button>}
            <Button variant="link"><Link to="/rents/active">My rents</Link></Button>
            <Button variant="link"><Link to="/rents/history">History</Link></Button>
            <Badge variant="info">{user._id}</Badge>
            <Button variant="link" onClick={this.onLogout}>Logout</Button>
          </>
          : <>
            <Button variant="link"><Link to="/login">Login</Link></Button>
            <Button variant="link"><Link to="/sign-up">Sign up</Link></Button>
          </>
        }
      </nav>
    );
  }
}
