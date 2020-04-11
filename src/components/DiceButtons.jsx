
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from './generics/Button';

export default class DiceButtons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customNumber: 1, // the custom number of dice to roll
            buttonsHidden: false,
            buttonsWidth: 0, // the buttons width in px
        }
        this.hideableButtonRef = React.createRef();
    }

    /**
     * @description
     * handles when the browser window resizes
     */
    onResizeWindow = () => {
        if (this.hideableButtonRef.current !== null) {
            this.setState({ buttonsWidth: this.hideableButtonRef.current.scrollWidth });
        }
    }

    componentDidMount() {
        this.onResizeWindow();
        window.addEventListener('resize', this.onResizeWindow);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResizeWindow);
    }

    /**
     * @description
     * calls the onClick function if provided
     * @param {number} diceSides
     * @param {number} numberOfDice
     */
    handleRollDiceClick = (diceSides, numberOfDice) => {
        if (this.props !== null && typeof this.props.onClick === 'function') {
            const diceRollArray = Array(numberOfDice).fill(diceSides);
            this.props.onClick(diceRollArray);
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

    /**
     * @description handles the change in button visibility
     */
    handleChangeVisibilityClick = () => {
        const { buttonsHidden } = this.state;
        this.setState({ buttonsHidden: !buttonsHidden });
    }

    /**
     * @description
     * returns the style for the hideable buttons container
     * @returns { {left: number} }
     */
    getOffset() {
        const { buttonsHidden, buttonsWidth } = this.state;
        if (buttonsHidden === false) {
            return {};
        }
        else {
            return { left: `calc(${-buttonsWidth}px - 1em)` };
        }
    }

    /**
     * @inheritdoc
     */
    render() {

        const { customNumber, buttonsHidden } = this.state;
        return (
            <div className='dice-buttons'>
                <Button
                    className='hide-show-button no-shrink'
                    onClick={this.handleChangeVisibilityClick}
                    icon={buttonsHidden ? 'chevron-right' : 'chevron-left'}
                />
                <div ref={this.hideableButtonRef} className='hideable-buttons-container' style={this.getOffset()}>
                    <Button onClick={() => { this.handleCustomNumberChangeClick(true); }} icon='plus' />
                    <Button onClick={() => { this.handleCustomNumberChangeClick(false); }} icon='minus' />
                    <Button onClick={() => { this.handleRollDiceClick(4, customNumber) }}>{customNumber} D4</Button>
                    <Button onClick={() => { this.handleRollDiceClick(6, customNumber) }}>{customNumber} D6</Button>
                    <Button onClick={() => { this.handleRollDiceClick(8, customNumber) }}>{customNumber} D8</Button>
                    <Button onClick={() => { this.handleRollDiceClick(10, customNumber) }}>{customNumber} D10</Button>
                    <Button onClick={() => { this.handleRollDiceClick(12, customNumber) }}>{customNumber} D12</Button>
                    <Button onClick={() => { this.handleRollDiceClick(20, customNumber) }}>{customNumber} D20</Button>
                </div>
            </div>
        );
    }
}

DiceButtons.propTypes = {
    onClick: PropTypes.func.isRequired,
};