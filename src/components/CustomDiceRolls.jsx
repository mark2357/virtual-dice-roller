
import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { Button } from './generics/Button';
import { CustomRollsDataProps } from '../propTypes/CustomRollsDataProps';

export default class CustomDiceRolls extends Component {

    constructor(props) {
        super(props);

        this.state = {
            buttonsHidden: false,
            editMode: false,
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
     * returns the style for the hideable buttons container
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
     * @description
     * toggles edit mode
     */
    handleToggleEditMode = () => {
        const { editMode } = this.state;
        this.setState({ editMode: !editMode });
    }

    /**
     * @inheritdoc
     */
    render() {
        const { buttonsHidden, editMode } = this.state;
        const { onEditCustomDiceRollClick, customRollsData } = this.props;

        const customRollsButtons = [];
        customRollsData.forEach((customRollData, index) => {
            customRollsButtons.push(
                <div className='custom-roll-row' key={index}>
                    <Button
                        className={`${editMode ? '' : 'hidden'}`}
                        onClick={() => { onEditCustomDiceRollClick(index); }}
                        icon='edit'
                    />
                    <Button
                        className='button-long'
                        onClick={() => { this.handleRollDiceClick(customRollData.diceRollArray, customRollData.customResultCalculation); }}
                    >
                        <span>{customRollData.name}</span>
                    </Button>
                </div>
            );
        });

        return (
            <div className='custom-dice-rolls'>
                <Button
                    className='hide-show-button'
                    onClick={this.handleChangeVisibilityClick}
                    icon={buttonsHidden ? 'chevron-left' : 'chevron-right'}
                />
                <div ref={this.hideableButtonRef} className='hideable-buttons-container' style={this.getOffset()}>
                    <div className='edit-buttons-row'>
                        <Button onClick={() => { onEditCustomDiceRollClick(-1); }} icon='plus' />
                        <Button className={editMode ? 'toggled-enabled' : 'toggled-disabled'} onClick={this.handleToggleEditMode} icon='edit' />
                    </div>
                    <Button className='button-long' onClick={() => { this.handleRollDiceClick([20, 20], 'MAX(@D, @D)'); }}><span>Roll Advantage</span></Button>
                    <Button className='button-long' onClick={() => { this.handleRollDiceClick([20, 20], 'MIN(@D, @D)'); }}><span>Roll Disadvantage</span></Button>
                    {customRollsButtons}
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