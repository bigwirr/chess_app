import React, { Component } from 'react';
import './App.css';
import { ChessGame } from "./components/ChessGame";

class App extends Component {
  render() { 
    return (
      <div className="App">
        <ChessGame />
      </div>
    );
  }
}

export default App;
