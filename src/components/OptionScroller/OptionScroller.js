import React from 'react';
import _ from 'lodash';
import './OptionScroller.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      options: props.options,
      selectedOption: props.selectedOption,
    };
  }
  
  onPrevClick = () => {
    const {options, selectedOption} = this.state;
    const currIndex = options.indexOf(selectedOption);
    const newSelectedOption = options[(currIndex + options.length - 1) % options.length];
    this.setState({selectedOption: newSelectedOption}, () => {this.props.onChange(newSelectedOption)});
  };
  
  onNextClick = () => {
    const {options, selectedOption} = this.state;
    const currIndex = options.indexOf(selectedOption);
    const newSelectedOption = options[(currIndex + 1) % options.length];
    this.setState({selectedOption: newSelectedOption}, () => {this.props.onChange(newSelectedOption)});
  };
  
  render() {
    const {options, selectedOption} = this.state;
    
    if (!_.includes(options, selectedOption)) {
      throw new Error(`The value provided for selectedOption prop (${selectedOption}) is not included in the options array (${options}).`);
    }
    
    return (
      <div className="option-scroller">
        <button type="button" onClick={this.onPrevClick}>&lt;</button>
        <div className="selected-option-label">
          {this.state.selectedOption}
        </div>
        <button type="button" onClick={this.onNextClick}>&gt;</button>
      </div>
    );
  }
}

export default App;
