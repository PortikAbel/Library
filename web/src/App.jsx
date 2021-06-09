import React from 'react';
import autoBind from 'auto-bind';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Books from './components/Books';
import RegisterBook from './components/RegisterBook';
import Login from './components/Login';
import NavBar from './components/NavBar';
import BookRents from './components/BookRents';
import UserRents from './components/UserRents';
import SignUp from './components/SignUp';
import { getUser } from './service/auth';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
    autoBind(this);
  }

  handleLogin(user) {
    this.setState({ user });
  }

  handleLogout() {
    this.setState({ user: null });
  }

  async componentDidMount() {
    try {
      const user = await getUser();
      this.setState({ user });
    } catch (err) {
      this.setState({ err });
    }
  }

  render() {
    const { user } = this.state;
    return (
      <BrowserRouter>
        <Route component={(params) => <NavBar user={user} handleLogout={this.handleLogout} {...params}/>} />
        <main>
          <Switch>
            <Route exact path="/" component={(params) => <Books user={user} {...params}/>} />
            <Route exact path="/books/register" component={(params) => <RegisterBook {...params}/>} />
            <Route exact path="/books/:isbn/rents" component={BookRents} />
            <Route exact path="/users/rents" component={UserRents} />
            <Route exact path="/sign-up" component={(params) => <SignUp handleLogin={this.handleLogin} {...params}/>} />
            <Route exact path="/login" component={(params) => <Login handleLogin={this.handleLogin} {...params}/>} />
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}