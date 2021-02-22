import React from 'react';
import _ from 'lodash';
import './Gameboard.css';
import cardConfigs from '../../configs/card-configs';

class Gameboard extends React.Component {
  constructor(props) {
    super(props);
    
    const {gameboardConfig} = this.props;
    const {tilesPerRow, tilesPerColumn, backgroundWidth} = gameboardConfig;
    const tileCount = tilesPerRow * tilesPerColumn;
    const tiles = [];
    
    for (let x=1; x<=tileCount; x++) {
      tiles.push({
        id: x,
        cardImgUrl: cardConfigs[`card${Math.round(x / 2)}`],
        value: Math.round(x / 2),
        status: 'hidden' // matched, visible, or hidden
      });
    }
    
    this.state = {
      tiles: _.shuffle(tiles),
      // tiles: tiles,
      status: 'active', // active or complete
      width: backgroundWidth
    }
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  
  updateDimensions = () => {
    const {gameboardConfig} = this.props;
    const {backgroundWidth, backgroundHeight} = gameboardConfig;
    const gameboardHeight = `${document.getElementsByClassName('gameboard-container')[0].clientHeight}px`;
    const gameboardWidth = `${parseInt(backgroundWidth) * (parseInt(gameboardHeight) / parseInt(backgroundHeight))}px`;
    this.setState({width: gameboardWidth, height: gameboardHeight});
  }
  
  onTileClick = (tileId) => {
    let tiles = _.cloneDeep(this.state.tiles);
    let clickedTile = _.find(tiles, {id: tileId});
    let otherVisibleTile = _.find(tiles, {status: 'visible'});
    
    if (clickedTile.status === 'matched' || clickedTile.status === 'visible') // Clicked on same tile twice...do nothing
      return;
      
    if (_.size(_.filter(tiles, {status: 'visible'})) > 1)  // Clicked a tile before previously clicked tiles had flipped back over...do nothing
      return;
    
    clickedTile.status = 'visible';
    
    this.setState({tiles}, () => {
      if (otherVisibleTile) {
        tiles = _.cloneDeep(tiles);
        clickedTile = _.find(tiles, {id: clickedTile.id});
        otherVisibleTile = _.find(tiles, {id: otherVisibleTile.id});
        if (clickedTile.value === otherVisibleTile.value) {
          clickedTile.cardClassName = 'shrink-until-gone';
          otherVisibleTile.cardClassName = 'shrink-until-gone';
          this.setState({tiles}, () => {
            tiles = _.cloneDeep(tiles);
            clickedTile = _.find(tiles, {id: clickedTile.id});
            otherVisibleTile = _.find(tiles, {id: otherVisibleTile.id});
            clickedTile.status = 'matched';
            otherVisibleTile.status = 'matched';
            const status = _.every(tiles, {status: 'matched'}) ? 'complete' : 'active';
            setTimeout(() => {this.setState({tiles, status})}, 1000);
          });
        } else {
          clickedTile.className = 'shake';
          otherVisibleTile.className = 'shake';
          this.setState({tiles}, () => {
            tiles = _.cloneDeep(tiles);
            clickedTile = _.find(tiles, {id: clickedTile.id});
            otherVisibleTile = _.find(tiles, {id: otherVisibleTile.id});
            clickedTile.status = 'hidden';
            otherVisibleTile.status = 'hidden';
            clickedTile.className = null;
            otherVisibleTile.className = null;
            setTimeout(() => {this.setState({tiles})}, 1000);
          });
        }
      }
    });
  };
  
  generateTileElements = () => {
    const {tiles, status} = this.state;
    const {gameboardConfig} = this.props;
    const {tilesPerRow, tilesPerColumn, backgroundWidth, backgroundHeight} = gameboardConfig;
    const tileWidth = `${Math.trunc(parseInt(backgroundWidth) / tilesPerRow) / parseInt(backgroundWidth) * 100}%`;
    const tileHeight = `${Math.trunc(parseInt(backgroundHeight) / tilesPerColumn) / parseInt(backgroundHeight) * 100}%`;
    
    return _.map(tiles, tile => {
      const tileBorder = status === 'active' ? '1px solid' : 'none';
      const tileCursor = tile.status === 'hidden' ? 'pointer' : 'default';
      const tileClassName = tile.className;
      const cardClassName = tile.cardClassName;
      
      return (
        <div 
          key={tile.id}
          className={`gameboard-tile ${tileClassName ? tileClassName : ''}`}
          style={{border: tileBorder, cursor: tileCursor, height: tileHeight, width: tileWidth}}
          onClick={() => {this.onTileClick(tile.id)}}
        >
          {tile.status === 'matched' &&
            <div style={{display: tile.status === 'matched' ? 'block' : 'none', background: 'transparent'}} />
          }
          {tile.status !== 'matched' &&
            <div className={`card ${tile.status === 'visible' ? 'is-flipped' : ''} ${cardClassName ? cardClassName : ''}`}>
              <div className="face" style={{background: `white url('${cardConfigs.cardBack}') left/cover no-repeat`}} />
              <div className="face" style={{background: `white url('${tile.cardImgUrl}') center/contain no-repeat`, transform: 'rotateY(180deg)'}} />
            </div>
          }
        </div>
      );
    });
  };
  
  render() {
    const {gameboardConfig} = this.props;
    const {backgroundClassName, backgroundHeight} = gameboardConfig;
    
    return (
      <div className="gameboard-container">
        <div className="gameboard-title">Swimsuit Memory</div>
        <div className="gameboard-instruction">Find matches by clicking on cards</div>
        <div 
          className={`gameboard ${backgroundClassName}`}
          style={{maxHeight: backgroundHeight, width: this.state.width}}
          >
            {this.generateTileElements()}
        </div>
        <div><button type="button" onClick={this.props.onNewGameClick}>Return to Start Screen</button></div>
      </div>
      
    );
  }
}

export default Gameboard;
