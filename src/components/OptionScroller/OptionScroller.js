import React from 'react';
import _ from 'lodash';
import './OptionScroller.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    const options = this.generateOptionObjects(props.options, props.selectedOption);
    const selectedOption = _.find(options, {text: props.selectedOption});
    
    this.state = {
      options,
      selectedOption
    };
  }
  
  generateOptionObjects = (options, selectedOption) => {
    return _.map(options, option => {
      return {
        text: option,
        animationClassName: option !== selectedOption ? 'enter-from-left' : null
      }
    });
  };
  
  onPrevClick = () => {
    const {options, selectedOption: previouslySelectedOption} = this.state;
    const currIndex = _.findIndex(options, {text: previouslySelectedOption.text});
    const newSelectedOption = options[(currIndex + options.length - 1) % options.length];
    
    previouslySelectedOption.animationClassName = 'exit-left';
    newSelectedOption.animationClassName = 'enter-from-right';
    
    this.setState({selectedOption: previouslySelectedOption}, () => {
      setTimeout(() => {
        this.setState({selectedOption: newSelectedOption}, () => {
          this.props.onChange(newSelectedOption.text)
        });
      }, 125)
    });
  };
  
  onNextClick = () => {
    const {options, selectedOption: previouslySelectedOption} = this.state;
    const currIndex = _.findIndex(options, {text: previouslySelectedOption.text});
    const newSelectedOption = options[(currIndex + options.length + 1) % options.length];
    
    previouslySelectedOption.animationClassName = 'exit-right';
    newSelectedOption.animationClassName = 'enter-from-left';
    
    this.setState({selectedOption: previouslySelectedOption}, () => {
      setTimeout(() => {
        this.setState({selectedOption: newSelectedOption}, () => {
          this.props.onChange(newSelectedOption.text)
        });
      }, 125)
    });
  };
  
  render() {
    const {selectedOption} = this.state;
    const {text: selectedOptionDisplayText, animationClassName} = selectedOption;
    
    return (
      <div className="option-scroller">
        <button type="button" onClick={this.onPrevClick}>&lt;</button>
        <div className="selected-option-label-container">
          <div className={`selected-option-label ${animationClassName ? animationClassName : ''}`}>
            {selectedOptionDisplayText}
          </div>
        </div>
        <button type="button" onClick={this.onNextClick}>&gt;</button>
      </div>
    );
  }
}

export default App;
