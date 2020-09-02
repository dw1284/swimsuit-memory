import React from 'react';
import _ from 'lodash';
import './App.css';
import StartScreen from './StartScreen/StartScreen';
import Gameboard from './Gameboard/Gameboard';
import cardConfigs from '../configs/card-configs';

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
  
  generateElementsToPreload = () => {
    // Optimization hack:
    // Preload all card images into img elements
    // This guarantees two things:
    //  1. All images will be loaded up front and the user won't experience lag when clicking cards
    //  2. We only download the images once per session...no matter how many times the user plays the game
    return (
      <div className="preload">
        {_.map(cardConfigs, cardUrl => <img key={_.uniqueId()} src={cardUrl} />)}
      </div>
    );
  };
  
  render() {
    const {gameboardConfig} = this.state;
    const preloadElement = this.generateElementsToPreload();
    const renderElement = gameboardConfig
      ? <Gameboard gameboardConfig={gameboardConfig} onNewGameClick={this.onNewGameClick} />
      : <StartScreen onStartGameClick={this.onStartGameClick} />;
    
    return (
      <div className="app">
        {preloadElement}
        {renderElement}
      </div>
    );
  }
}

export default App;
