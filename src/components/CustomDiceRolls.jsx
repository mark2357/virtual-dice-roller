
import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { Button } from './generics/Button';
import { withFullScreenPanelContext } from './providers/FullScreenPanelProvider';
import { withPersistentDataContext } from './providers/PersistentDataProvider';

import { PANEL_TYPES } from '../constants/PanelTypes';
import { FullScreenPanelDataProps } from '../propTypes/FullScreenPanelDataProps';
import { PersistentDataProps } from '../propTypes/PersistentDataProps';

class CustomDiceRolls extends Component {

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
            return { marginRight: `calc(${-buttonsWidth}px - 1em)` };
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
     * @description
     * shows the p
     */
    handleShowCreateCustomRollPanel = (index) => {
        const {persistentData, fullScreenPanelData } = this.props;
        const { customRollsData } = persistentData;

        //creating new custom roll
        if(index === -1) {
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


    /**
     * @inheritdoc
     */
    render() {
        const { buttonsHidden, editMode } = this.state;
        const { persistentData } = this.props;
        const { customRollsData } = persistentData;

        const customRollsButtons = [];
        customRollsData.forEach((customRollData, index) => {
            customRollsButtons.push(
                <div className='custom-roll-row' key={index}>
                    <Button
                        className={`${editMode ? '' : 'hidden'}`}
                        onClick={() => {this.handleShowCreateCustomRollPanel(index); }}
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
                    className='hide-show-button no-shrink'
                    onClick={this.handleChangeVisibilityClick}
                    icon={buttonsHidden ? 'chevron-left' : 'chevron-right'}
                />
                <div ref={this.hideableButtonRef} className='hideable-buttons-container' style={this.getOffset()}>
                    <div className='edit-buttons-row'>
                        <Button
                            icon='plus'
                            onClick={() => {this.handleShowCreateCustomRollPanel(-1); }}
                        />
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
    fullScreenPanelData: PropTypes.shape(FullScreenPanelDataProps).isRequired,
    persistentData: PropTypes.shape(PersistentDataProps).isRequired,
};


export default withPersistentDataContext(withFullScreenPanelContext(CustomDiceRolls));