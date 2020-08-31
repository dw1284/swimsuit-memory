import React from 'react';
import './App.css';
import StartScreen from './StartScreen/StartScreen';
import Gameboard from './Gameboard/Gameboard';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      gameboardConfig: null,
    };
  }
  
  onStartGameClick = (gameboardConfig) => {
      this.setState({gameboardConfig});
  };
  
  onNewGameClick = () => {
    this.setState({gameboardConfig: null});
  };
  
  render() {
    const {gameboardConfig} = this.state;
    
    const renderElement = gameboardConfig
      ? <Gameboard gameboardConfig={gameboardConfig} onNewGameClick={this.onNewGameClick} />
      : <StartScreen onStartGameClick={this.onStartGameClick} />;
      
    return (
      <div className="app">
        {renderElement}
      </div>
    );
  }
}

export default App;
