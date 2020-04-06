
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../css/customDiceRolls.scss';
import { Button } from './generics/Button';
import { CustomRollsDataProps } from '../propTypes/CustomRollsDataProps';

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
     * @param {Array<number>} diceRollArray
     * @param {string} customResultCalculation
     */
    handleRollDiceClick = (diceRollArray, customResultCalculation) => {
        if (this.props !== null && typeof this.props.onDiceRollClick === 'function') {
            this.props.onDiceRollClick(diceRollArray, customResultCalculation);
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
        const { onEditCustomDiceRollClick, customRollsData } = this.props;

        const customRollsButtons = [];
        customRollsData.forEach(customRollData => {
            customRollsButtons.push(
                <Button
                    className='button-long'
                    onClick={() => { this.handleRollDiceClick(customRollData.diceRollArray, customRollData.customResultCalculation); }}
                >
                    <span>{customRollData.name}</span>
                </Button>
            );
        });

        return (
            <div className='custom-dice-rolls'>
                <Button className='hide-show-button' onClick={this.handleChangeVisibilityClick}>
                    {buttonsHidden ? <FontAwesomeIcon icon='chevron-left' /> : <FontAwesomeIcon icon='chevron-right' />}
                </Button>
                <div className='buttons-container'>
                    <div ref={this.hidableButtonRef} className='hidable-buttons-container' style={this.getOffset()}>
                        <Button className='button-long' onClick={() => { this.handleRollDiceClick([20, 20], 'MAX(@D, @D)'); }}><span>Roll Advantage</span></Button>
                        <Button className='button-long' onClick={() => { this.handleRollDiceClick([20, 20], 'MIN(@D, @D)'); }}><span>Roll Disadvantage</span></Button>
                        {customRollsButtons}
                        <Button className='dice-button' onClick={() => { onEditCustomDiceRollClick(-1); }}><FontAwesomeIcon icon='plus' /></Button>
                        {/* <Button className='dice-button' onClick={() => { this.onEditCustomDiceRollClick(0); }}><FontAwesomeIcon icon='edit' /></Button> */}
                    </div>
                </div>
            </div>
        );
    }
}

CustomDiceRolls.propTypes = {
    onDiceRollClick: PropTypes.func.isRequired,
    onEditCustomDiceRollClick: PropTypes.func.isRequired,
    customRollsData: PropTypes.arrayOf(CustomRollsDataProps),
};