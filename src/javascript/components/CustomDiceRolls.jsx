//modules
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// proptypes
import { FullScreenPanelDataProps } from '../propTypes/FullScreenPanelDataProps';
import { PersistentDataProps } from '../propTypes/PersistentDataProps';

// providers
import { withFullScreenPanelContext } from './providers/FullScreenPanelProvider';
import { withPersistentDataContext } from './providers/PersistentDataProvider';

//constants
import PANEL_TYPES from '../constants/PanelTypes';

// components
import Button from './generics/Button';


class CustomDiceRolls extends Component {

    constructor(props) {
        super(props);

        this.state = {
            buttonsHidden: false,
        }
        this.hideableButtonRef = React.createRef();
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
     * @description
     * handles the change in button visibility
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
        const { buttonsHidden } = this.state;

        if (buttonsHidden === true && this.hideableButtonRef.current !== null) {
            const buttonsWidth = this.hideableButtonRef.current.scrollWidth;
            return { marginRight: `calc(${-buttonsWidth}px - 1em)` };
        } 
        else {
            return {};
        }
    }

    /**
     * @description
     * shows the create custom roll panel
     */
    handleShowCreateCustomRollPanel = (index) => {
        const { persistentData, fullScreenPanelData } = this.props;
        const { customRollsData } = persistentData;

        //creating new custom roll
        if (index === -1) {
            fullScreenPanelData.showPanel(PANEL_TYPES.CREATE_CUSTOM_ROLL_PANEL, {
                createNew: true,
                index: null,
            });
        }
        // editing existing custom roll
        else {
            fullScreenPanelData.showPanel(PANEL_TYPES.CREATE_CUSTOM_ROLL_PANEL, {
                createNew: false,
                customRollData: customRollsData[index],
                index,
            });
        }
    }

    render() {
        const { buttonsHidden } = this.state;
        const { persistentData, fullScreenPanelData } = this.props;
        const { customRollsData } = persistentData;


        const customRollsButtons = [];
        customRollsData.forEach((customRollData, index) => {
            if (!customRollData.hidden) {
                customRollsButtons.push(
                    <div className='custom-roll-row' key={index}>
                        <Button
                            className='button-long'
                            onClick={() => { this.handleRollDiceClick(customRollData.diceRollArray, customRollData.customResultCalculation); }}
                        >
                            <span>{customRollData.name}</span>
                        </Button>
                    </div>
                );
            }
        });

        return (
            <div className='custom-dice-rolls'>
                <Button
                    className='hide-show-button no-shrink'
                    onClick={this.handleChangeVisibilityClick}
                    icon={buttonsHidden ? 'chevron-left' : 'chevron-right'}
                />
                <div ref={this.hideableButtonRef} className='hideable-buttons-container' style={this.getOffset()}>
                    <div className='edit-buttons-row'>
                        <Button icon='edit' onClick={() => { fullScreenPanelData.showPanel(PANEL_TYPES.SELECT_EDIT_CUSTOM_ROLL_PANEL); }} />
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
    fullScreenPanelData: PropTypes.shape(FullScreenPanelDataProps).isRequired,
    persistentData: PropTypes.shape(PersistentDataProps).isRequired,
};


export default withPersistentDataContext(withFullScreenPanelContext(CustomDiceRolls));