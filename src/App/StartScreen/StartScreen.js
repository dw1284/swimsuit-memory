import React from 'react';
import _ from 'lodash';
import './StartScreen.css';
import OptionScroller from '../../components/OptionScroller/OptionScroller';
import gameboardConfigs from '../../configs/gameboard-configs';

const gameboardOptions = [..._.map(gameboardConfigs, 'name'), 'Random'];

class StartScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      gameboardSelection: 'Random',
    };
  }
  
  onStartGameClick = () => {
    const {gameboardSelection} = this.state;
    const gameboardConfig = gameboardSelection === 'Random' 
      ? _.sample(gameboardConfigs)
      : _.find(gameboardConfigs, {name: gameboardSelection});
    
    if (this.props.onStartGameClick)
      this.props.onStartGameClick(gameboardConfig);
  };
  
  onGameboardSelectionChange = (gameboardSelection) => {
    this.setState({gameboardSelection});
  };
  
  render() {
    return (
      <div className="start-screen">
        <div className="start-title">
          Swimsuit Memory
        </div>
        <button 
          type="button"
          className="start-game-button"
          onClick={this.onStartGameClick}>
            Start Game
        </button>
        <div className="board-selector-container">
          <div className="board-selector-label">
            Gameboard: 
          </div>
          <OptionScroller
            options={gameboardOptions}
            selectedOption={this.state.gameboardSelection}
            onChange={this.onGameboardSelectionChange}
          />
        </div>
      </div>
    );
  }
}

export default StartScreen;
