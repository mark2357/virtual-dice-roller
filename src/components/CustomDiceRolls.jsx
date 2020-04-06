
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../css/customDiceRolls.scss';
import { Button } from './generics/Button';

export default class CustomDiceRolls extends Component {

    constructor(props) {
        super(props);

        this.state = {
            buttonsHidden: false,
            buttonsWidth: 0, // the buttons width in px
        }
        this.hidableButtonRef = React.createRef();
    }

    /**
     * @description
     * handles when the browser window resizes
     */
    onResizeWindow = () => {
        if (this.hidableButtonRef.current !== null) {
            this.setState({ buttonsWidth: this.hidableButtonRef.current.scrollWidth });
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
     * @description handles the change in button visibility
     */
    handleChangeVisibilityClick = () => {
        const { buttonsHidden } = this.state;
        this.setState({ buttonsHidden: !buttonsHidden });
    }

    /**
     * @description
     * returns the style for the hidable buttons container
     * @returns { {left: number} }
     */
    getOffset() {
        const { buttonsHidden, buttonsWidth } = this.state;
        if (buttonsHidden === false) {
            return {};
        }
        else {
            return { right: `calc(${-buttonsWidth}px - 1em)` };
        }
    }

    /**
     * @inheritdoc
     */
    render() {

        const { buttonsHidden } = this.state;
        return (
            <div className='custom-dice-rolls'>
                <Button className='hide-show-button dice-button' onClick={this.handleChangeVisibilityClick}>
                    {buttonsHidden ? <FontAwesomeIcon icon='chevron-left' /> : <FontAwesomeIcon icon='chevron-right' />}
                </Button>
                <div className='buttons-container'>
                    <div ref={this.hidableButtonRef} className='hidable-buttons-container' style={this.getOffset()}>
                        <Button className='dice-button' onClick={() => {  }}><FontAwesomeIcon icon='plus' /></Button>
                        <Button className='dice-button' onClick={() => {  }}><FontAwesomeIcon icon='edit' /></Button>
                        <Button className='dice-button' onClick={() => {  }}><FontAwesomeIcon icon='edit' /></Button>
                    </div>
                </div>
            </div>
        );
    }
}

CustomDiceRolls.propTypes = {
    onClick: PropTypes.func.isRequired,
};