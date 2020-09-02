import React from 'react';
import _ from 'lodash';
import './Gameboard.css';
import cardConfigs from '../../configs/card-configs';

class Gameboard extends React.Component {
  constructor(props) {
    super(props);
    
    const {gameboardConfig} = this.props;
    const {tilesPerRow, tilesPerColumn} = gameboardConfig;
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
      status: 'active' // active or complete
    }
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
          clickedTile.status = 'matched';
          otherVisibleTile.status = 'matched';
          const status = _.every(tiles, {status: 'matched'}) ? 'complete' : 'active';
          setTimeout(() => {this.setState({tiles, status})}, 250);
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
      
      return (
        <div 
          key={tile.id}
          className={`gameboard-tile ${tileClassName ? tileClassName : ''}`}
          style={{border: tileBorder, cursor: tileCursor, height: tileHeight, width: tileWidth}}
          onClick={() => {this.onTileClick(tile.id)}}
        >
          <div style={{display: tile.status === 'matched' ? 'block' : 'none', background: 'transparent'}} />
          <div style={{display: tile.status === 'hidden'  ? 'block' : 'none', background: 'white'}} />
          <div style={{display: tile.status === 'visible' ? 'block' : 'none', background: `white url('${tile.cardImgUrl}') center/contain no-repeat`}} />
        </div>
      );
    });
  };
  
  render() {
    const {gameboardConfig} = this.props;
    const {backgroundClassName, backgroundWidth, backgroundHeight} = gameboardConfig;
    
    return (
      <div className="gameboard-container">
        <div className="gameboard-title">Swimsuit Memory</div>
        <div 
          className={`gameboard ${backgroundClassName}`}
          style={{height: backgroundHeight, width: backgroundWidth}}
          >
            {this.generateTileElements()}
        </div>
        <div><button type="button" onClick={this.props.onNewGameClick}>Return to Start Screen</button></div>
      </div>
      
    );
  }
}

export default Gameboard;
