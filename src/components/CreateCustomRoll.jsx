import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../css/createCustomRoll.scss';

import calculateCustomDiceRollResult from '../helpers/calculateCustomDiceRollResult';

import { ValueCounter } from './generics/ValueCounter';
import { Button } from './generics/Button';
import { CustomRollsDataProps, CustomRollsDataDefaultProps } from '../propTypes/CustomRollsDataProps';


export default class CreateCustomRoll extends Component {

    constructor(props) {
        super(props);

        const {
            customRollData,
            createNew,
        } = props;


        let bonusCount = 0;
        if (createNew === false) {
            const {
                customResultCalculation,
            } = customRollData;

            // determines the bonus by simulating a roll where all dice rolls are 0
            const numberOfDice = customResultCalculation.match(/@D/g) === null ? 0 : customResultCalculation.match(/@D/g).length;
            const bonusTestDiceRollArray = Array(numberOfDice).fill(0);
            bonusCount = calculateCustomDiceRollResult(bonusTestDiceRollArray, customResultCalculation).value;
        }


        this.state = {
            d20Count: createNew ? 1 : customRollData.diceRollArray.filter(x => x == 20).length,
            d12Count: createNew ? 0 : customRollData.diceRollArray.filter(x => x == 12).length,
            d10Count: createNew ? 0 : customRollData.diceRollArray.filter(x => x == 10).length,
            d8Count: createNew ? 0 : customRollData.diceRollArray.filter(x => x == 8).length,
            d6Count: createNew ? 0 : customRollData.diceRollArray.filter(x => x == 6).length,
            d4Count: createNew ? 0 : customRollData.diceRollArray.filter(x => x == 4).length,
            bonusCount: bonusCount,
            customRollName: createNew ? '' : customRollData.name,
        };
    }

    /**
     * @description
     * returns data for the currently edited or created custom roll
     * @returns {{name: string, diceRollArray: Array<number>, customResultCalculation: string}}
     */
    getSaveData = () => {
        const {
            customRollName,
            d20Count,
            d12Count,
            d10Count,
            d8Count,
            d6Count,
            d4Count,
            bonusCount,
        } = this.state;

        let customResultCalculation = '';
        const totalDice = d20Count + d12Count + d10Count + d8Count + d6Count + d4Count;

        for (let i = 0; i < totalDice; i++) customResultCalculation += `@D ${i < totalDice - 1 ? '+ ' : ''}`;

        // only add bonus count if it's not 0
        if (bonusCount !== 0) customResultCalculation += bonusCount > 0 ? `+ ${bonusCount}` : `- ${Math.abs(bonusCount)}`;

        const saveData = {
            name: customRollName,
            // fills the array with the required number of dice
            diceRollArray: [
                ...Array(d20Count).fill(20),
                ...Array(d12Count).fill(12),
                ...Array(d10Count).fill(10),
                ...Array(d8Count).fill(8),
                ...Array(d6Count).fill(6),
                ...Array(d4Count).fill(4),
            ],
            customResultCalculation: customResultCalculation,
        };
        return saveData;
    }

    /**
     * @description
     * handles when the count for a dice ic changed
     * @param {number} diceNumber, the number of sides on the dice (uses 0 for bonus Count) 
     * @param {number} deltaValue, change in the number of dice
     */
    handleCounterOnclick(diceNumber, deltaValue) {
        const {
            d20Count, d12Count, d10Count, d8Count, d6Count, d4Count, bonusCount
        } = this.state;

        let newValue = 0;

        switch (diceNumber) {
            case 20:
                newValue = Math.min(Math.max(d20Count + deltaValue, 0), 50);
                this.setState({ d20Count: newValue });
                break;
            case 12:
                newValue = Math.min(Math.max(d12Count + deltaValue, 0), 50);
                this.setState({ d12Count: newValue });
                break;
            case 10:
                newValue = Math.min(Math.max(d10Count + deltaValue, 0), 50);
                this.setState({ d10Count: newValue });
                break;
            case 8:
                newValue = Math.min(Math.max(d8Count + deltaValue, 0), 50);
                this.setState({ d8Count: newValue });
                break;
            case 6:
                newValue = Math.min(Math.max(d6Count + deltaValue, 0), 50);
                this.setState({ d6Count: newValue });
                break;
            case 4:
                newValue = Math.min(Math.max(d4Count + deltaValue, 0), 50);
                this.setState({ d4Count: newValue });
                break;
            case 0:
                newValue = Math.min(Math.max(bonusCount + deltaValue, -50), 50);
                this.setState({ bonusCount: newValue });
                break;
        }
    }

    /**
     * @description
     * updates the state with the new name
     * @param {React.SyntheticEvent} e
     * 
     */
    handleNameChange = (e) => {
        this.setState({ customRollName: e.target.value });
    }

    render() {

        const {
            d20Count, d12Count, d10Count, d8Count, d6Count, d4Count, bonusCount, customRollName,
        } = this.state;

        const { createNew, onSave, onDelete, onCancel } = this.props;

        const minRoll = d20Count + d12Count + d10Count + d8Count + d6Count + d4Count + bonusCount;
        const maxRoll = d20Count * 20 + d12Count * 12 + d10Count * 10 + d8Count * 8 + d6Count * 6 + d4Count * 4 + bonusCount;
        const avgRoll = minRoll + ((maxRoll - minRoll) / 2);

        return (
            <div className='create-custom-roll'>
                <div className='create-custom-roll-panel'>
                    <div className='header'>
                        <h2>{createNew ? 'Create New Custom Roll' : 'Edit Custom Roll'}</h2>
                    </div>
                    <hr />
                    <div className='content-container'>
                        <div className='name-wrapper'>
                            <span>Custom Roll Name: </span>
                            <input className='name-input' type='text' minLength="0" maxLength="25" value={customRollName} onChange={this.handleNameChange} />
                        </div>
                        <div className='counter-wrapper'>
                            <ValueCounter onClick={(deltaValue) => this.handleCounterOnclick(20, deltaValue)}>
                                <span>{d20Count}D20</span>
                            </ValueCounter>
                            <ValueCounter onClick={(deltaValue) => this.handleCounterOnclick(12, deltaValue)}>
                                <span>{d12Count}D12</span>
                            </ValueCounter>
                            <ValueCounter onClick={(deltaValue) => this.handleCounterOnclick(10, deltaValue)}>
                                <span>{d10Count}D10</span>
                            </ValueCounter>
                            <ValueCounter onClick={(deltaValue) => this.handleCounterOnclick(8, deltaValue)}>
                                <span>{d8Count}D8</span>
                            </ValueCounter>
                            <ValueCounter onClick={(deltaValue) => this.handleCounterOnclick(6, deltaValue)}>
                                <span>{d6Count}D6</span>
                            </ValueCounter>
                            <ValueCounter onClick={(deltaValue) => this.handleCounterOnclick(4, deltaValue)}>
                                <span>{d4Count}D4</span>
                            </ValueCounter>
                            <ValueCounter onClick={(deltaValue) => this.handleCounterOnclick(0, deltaValue)}>
                                <span>{`${bonusCount >= 0 ? '+' : ''}${bonusCount}`}</span>
                            </ValueCounter>
                        </div>
                        <div className='output-range-wrapper'>
                            <div>
                                <span>{`Range: ${minRoll} - ${maxRoll}`}</span>
                            </div>
                            <div>
                                <span>{`Average: ${avgRoll}`}</span>
                            </div>
                        </div>
                        {!createNew && (
                            <div className='delete-button-wrapper'>
                                <Button className='button-long' onClick={() => { onDelete(); }}>
                                    <div className='icon-wrapper'>
                                        <span>Delete</span>
                                        <FontAwesomeIcon icon='trash-alt' />
                                    </div>
                                </Button>
                            </div>
                        )}
                    </div>
                    <hr />
                    <div className='footer'>
                        <Button className='button-long' onClick={() => { onSave(this.getSaveData()); }}>
                            <div className='icon-wrapper'>
                                <span>Save</span>
                                <FontAwesomeIcon icon='save' />
                            </div>
                        </Button>
                        <Button className='button-long' onClick={() => { onCancel(); }}>
                            <div className='icon-wrapper'>
                                <span>Close</span>
                                <FontAwesomeIcon icon='times' />
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

CreateCustomRoll.propTypes = {
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    createNew: PropTypes.bool.isRequired,
    customRollData: CustomRollsDataProps,
};

CreateCustomRoll.defaultProps = {
    customRollData: CustomRollsDataDefaultProps,
}