import React, { Component } from 'react';
import './App.css';
import './css/Chess.css'
import { ChessGame } from "./components/ChessGame";

class App extends Component {
  render() { 
    return (
      <div className="Chessboard">
        <ChessGame />
      </div>
    );
  }
}

export default App;
