
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../css/diceButtons.css';

export default class DiceButtons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customNumber: 3,
            buttonsHidden: false,
        }
    }


    /**
     * @description
     * calls the onClick function if provided
     * @param {number} diceSides
     * @param {number} numberOfDice
     */
    handleRollDiceClick = (diceSides, numberOfDice) => {
        if (this.props !== null && typeof this.props.onClick === 'function') {
            this.props.onClick(diceSides, numberOfDice);
        }
    }

    /**
     * @description handles changes in the number of dice being rolled
     * @param {boolean} increase 
     */
    handleCustomNumberChangeClick = (increase) => {
        const { customNumber } = this.state;

        let newCustomNumber = customNumber;
        if (increase) {
            newCustomNumber++;
            this.setState({ customNumber: customNumber + 1 });
        }
        else {
            newCustomNumber--;
            this.setState({ customNumber: customNumber - 1 });
        }
        if (newCustomNumber < 1)
            newCustomNumber = 1;
        else if (newCustomNumber > 50)
            newCustomNumber = 50;

        this.setState({ customNumber: newCustomNumber });
    }

    /*
    * @description handles the change in button visibility
    */
    handleChangeVisibilityClick = () => {
        const { buttonsHidden } = this.state;
        this.setState({ buttonsHidden: !buttonsHidden });
    }

    /**
     * @inheritdoc
     */
    render() {

        const { customNumber, buttonsHidden } = this.state;
        return (
            <div className='dice-buttons'>
                {/* <div className='single-dice'>
                    <button onClick={() => { this.handleRollDiceClick(4, 1) }}>D4</button>
                    <button onClick={() => { this.handleRollDiceClick(6, 1) }}>D6</button>
                    <button onClick={() => { this.handleRollDiceClick(8, 1) }}>D8</button>
                    <button onClick={() => { this.handleRollDiceClick(10, 1) }}>D10</button>
                    <button onClick={() => { this.handleRollDiceClick(12, 1) }}>D12</button>
                    <button onClick={() => { this.handleRollDiceClick(20, 1) }}>D20</button>
                </div>
                <div className='double-dice'>
                    <button onClick={() => { this.handleRollDiceClick(4, 2) }}>2 D4</button>
                    <button onClick={() => { this.handleRollDiceClick(6, 2) }}>2 D6</button>
                    <button onClick={() => { this.handleRollDiceClick(8, 2) }}>2 D8</button>
                    <button onClick={() => { this.handleRollDiceClick(10, 2) }}>2 D10</button>
                    <button onClick={() => { this.handleRollDiceClick(12, 2) }}>2 D12</button>
                    <button onClick={() => { this.handleRollDiceClick(20, 2) }}>2 D20</button>
                </div> */}
                {/* <div className='custom-number'> */}
                <button className='dice-button hide-show-button' onClick={this.handleChangeVisibilityClick}>
                    {buttonsHidden ? '>' : '<'}
                </button>
                    <div className={`hidable-buttons-container${buttonsHidden ? ' hidden' : ''}`}>
                        <button className='dice-button' onClick={() => { this.handleCustomNumberChangeClick(true); }}>+</button>
                        <button className='dice-button' onClick={() => { this.handleCustomNumberChangeClick(false); }}>-</button>
                        <button className='dice-button' onClick={() => { this.handleRollDiceClick(4, customNumber) }}>{customNumber} D4</button>
                        <button className='dice-button' onClick={() => { this.handleRollDiceClick(6, customNumber) }}>{customNumber} D6</button>
                        <button className='dice-button' onClick={() => { this.handleRollDiceClick(8, customNumber) }}>{customNumber} D8</button>
                        <button className='dice-button' onClick={() => { this.handleRollDiceClick(10, customNumber) }}>{customNumber} D10</button>
                        <button className='dice-button' onClick={() => { this.handleRollDiceClick(12, customNumber) }}>{customNumber} D12</button>
                        <button className='dice-button' onClick={() => { this.handleRollDiceClick(20, customNumber) }}>{customNumber} D20</button>
                    </div>
                {/* </div> */}
            </div>
        );
    }
}

DiceButtons.propTypes = {
    onClick: PropTypes.func.isRequired,
};