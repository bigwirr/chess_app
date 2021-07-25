import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import userEvent from '@testing-library/user-event';
import { userInfo } from 'os';

interface State {
  users: User[]
}

interface User {
  username: string,
  id: number,
}

class App extends Component {
  state: State = { users: [] };

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
  }

  render() { 
    return (
      <div className="App">
        <h1>Users</h1>
        <ul>
          {this.state.users.map(user =>
            <li key={user.id}>{user.username}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default App;
