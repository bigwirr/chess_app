import React, { Component } from 'react';
import './App.css';
import './css/Chess.css'
import { ChessGame } from "./components/ChessGame";
import { TimeSettings } from './components/Timer';

class App extends Component {
  render() { 
    const timeSettings: TimeSettings = {
      timeInMinutes: 10,
      bonusTime: 0,
    }

    return (
      <div className="Chessboard">
        <ChessGame 
            timeSettings={ timeSettings } 
        />
      </div>
    );
  }
}

export default App;
