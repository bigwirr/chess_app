import { Component } from 'react';
import './App.css';
import './css/Chess.css'
import { RandomComputerGame } from './components/RandomComputerGame';

class App extends Component {
  render() { 
    return (
      <div className="chessGame">
        <RandomComputerGame />
      </div>
    );
  }
}

export default App;
