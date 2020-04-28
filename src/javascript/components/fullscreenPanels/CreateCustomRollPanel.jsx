// modules
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// components
import ValueCounter from '../generics/ValueCounter';
import Button from '../generics/Button';
import FullscreenPanelFrame from './FullscreenPanelFrame';
import PanelHeader from '../generics/PanelHeader';
import PanelFooter from '../generics/PanelFooter';


// providers
import { FullScreenPanelContext } from '../providers/FullScreenPanelProvider';
import { PersistentDataContext } from '../providers/PersistentDataProvider';

//helpers
import calculateCustomDiceRollResult from '../../helpers/calculateCustomDiceRollResult';


const CreateCustomRollPanel = (props) => {

    /**
     * @type {FullScreenPanelData}
     */
    const fullScreenPanelData = useContext(FullScreenPanelContext);

    /**
     * @type {PersistentData}
     */
    const persistentData = useContext(PersistentDataContext);

    const {
        createNew,
        index,
    } = props;

    const { customRollsData } = persistentData;
    // is null if creating new roll
    const customRollData = customRollsData[index] || null;



    const [d20Count, setD20Count] = useState(createNew ? 1 : customRollData.diceRollArray.filter(x => x == 20).length);
    const [d12Count, setD12Count] = useState(createNew ? 0 : customRollData.diceRollArray.filter(x => x == 12).length);
    const [d10Count, setD10Count] = useState(createNew ? 0 : customRollData.diceRollArray.filter(x => x == 10).length);
    const [d8Count, setD8Count] = useState(createNew ? 0 : customRollData.diceRollArray.filter(x => x == 8).length);
    const [d6Count, setD6Count] = useState(createNew ? 0 : customRollData.diceRollArray.filter(x => x == 6).length);
    const [d4Count, setD4Count] = useState(createNew ? 0 : customRollData.diceRollArray.filter(x => x == 4).length);
    const [customRollName, setCustomRollName] = useState(createNew ? '' : customRollData.name);
    const [bonusCount, setBonusCount] = useState(() => {
        if (createNew) return 0;
        
        // if not creating new roll determines bonus count from custom roll data
            const {
                customResultCalculation,
            } = customRollData;

            // determines the bonus by simulating a roll where all dice rolls are 0
            const numberOfDice = customResultCalculation.match(/@D/g) === null ? 0 : customResultCalculation.match(/@D/g).length;
            const bonusTestDiceRollArray = Array(numberOfDice).fill(0);
            return calculateCustomDiceRollResult(bonusTestDiceRollArray, customResultCalculation).value;
        });




    /**
     * @description
     * returns data for the currently edited or created custom roll
     * @returns {{name: string, diceRollArray: Array<number>, customResultCalculation: string}}
     */
    const getSaveData = () => {

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
            hidden: customRollData !== null ? customRollData.hidden : false,
        };
        return saveData;
    }

    /**
     * @description
     * handles when the count for a dice ic changed
     * @param {number} diceNumber, the number of sides on the dice (uses 0 for bonus Count) 
     * @param {number} deltaValue, change in the number of dice
     */
    const handleCounterOnclick = (diceNumber, deltaValue) => {

        let newValue = 0;

        switch (diceNumber) {
            case 20:
                newValue = Math.min(Math.max(d20Count + deltaValue, 0), 50);
                setD20Count(newValue);
                break;
            case 12:
                newValue = Math.min(Math.max(d12Count + deltaValue, 0), 50);
                setD12Count(newValue);
                break;
            case 10:
                newValue = Math.min(Math.max(d10Count + deltaValue, 0), 50);
                setD10Count(newValue);
                break;
            case 8:
                newValue = Math.min(Math.max(d8Count + deltaValue, 0), 50);
                setD8Count(newValue);
                break;
            case 6:
                newValue = Math.min(Math.max(d6Count + deltaValue, 0), 50);
                setD6Count(newValue);
                break;
            case 4:
                newValue = Math.min(Math.max(d4Count + deltaValue, 0), 50);
                setD4Count(newValue);
                break;
            case 0:
                newValue = Math.min(Math.max(bonusCount + deltaValue, -50), 50);
                setBonusCount(newValue);
                break;
        }
    }

    /**
     * @description
     * updates the state with the new name
     * @param {React.SyntheticEvent} e event from input element
     */
    const handleNameChange = (e) => {
        setCustomRollName(e.target.value);
    }

    /**
     * @description
     * handles saving new custom roll data
     * @param {{name: string, diceRollArray: number, customResultCalculation: string} | null} saveData
     */
    const handleSaveClick = () => {
        const { customRollsData } = persistentData;
        const saveData = getSaveData();


        //TODO: fix this as it is technically mutating the state
        // null is used to represent new custom roll
        if (index === null)
            customRollsData.push(saveData);
        else
            customRollsData[index] = saveData;


        persistentData.setCustomDiceRolls(customRollsData);
        fullScreenPanelData.closePanel();
    }

    /**
     * @description
     * handles when a custom roll is deleted
     */
    const handleDeleteClick = () => {
        const { customRollsData } = persistentData;

        const newCustomRollsData = customRollsData.filter((customRollData, i) => i !== index);
        persistentData.setCustomDiceRolls(newCustomRollsData);
        fullScreenPanelData.closePanel();
    }


    const minRoll = d20Count + d12Count + d10Count + d8Count + d6Count + d4Count + bonusCount;
    const maxRoll = d20Count * 20 + d12Count * 12 + d10Count * 10 + d8Count * 8 + d6Count * 6 + d4Count * 4 + bonusCount;
    const avgRoll = minRoll + ((maxRoll - minRoll) / 2);


    return (
        <FullscreenPanelFrame>
            <div className='create-custom-roll-panel'>
                <PanelHeader
                    title={createNew ? 'Create New Custom Roll' : 'Edit Custom Roll'}
                />
                <div className='content-container'>
                    <div className='name-wrapper'>
                        <span>Custom Roll Name: </span>
                        <input className='name-input' type='text' minLength="0" maxLength="25" value={customRollName} onChange={handleNameChange} />
                    </div>
                    <div className='counter-wrapper'>
                        <ValueCounter className='auto-shrink' onClick={(deltaValue) => handleCounterOnclick(20, deltaValue)}>
                            <span>{d20Count}D20</span>
                        </ValueCounter>
                        <ValueCounter className='auto-shrink' onClick={(deltaValue) => handleCounterOnclick(12, deltaValue)}>
                            <span>{d12Count}D12</span>
                        </ValueCounter>
                        <ValueCounter className='auto-shrink' onClick={(deltaValue) => handleCounterOnclick(10, deltaValue)}>
                            <span>{d10Count}D10</span>
                        </ValueCounter>
                        <ValueCounter className='auto-shrink' onClick={(deltaValue) => handleCounterOnclick(8, deltaValue)}>
                            <span>{d8Count}D8</span>
                        </ValueCounter>
                        <ValueCounter className='auto-shrink' onClick={(deltaValue) => handleCounterOnclick(6, deltaValue)}>
                            <span>{d6Count}D6</span>
                        </ValueCounter>
                        <ValueCounter className='auto-shrink' onClick={(deltaValue) => handleCounterOnclick(4, deltaValue)}>
                            <span>{d4Count}D4</span>
                        </ValueCounter>
                        <ValueCounter className='auto-shrink' onClick={(deltaValue) => handleCounterOnclick(0, deltaValue)}>
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
                        <Button className='button-long' onClick={handleDeleteClick}>
                            <div className='icon-wrapper'>
                                <span>Delete</span>
                                <FontAwesomeIcon icon='trash-alt' />
                            </div>
                        </Button>
                    )}
                </div>
                <PanelFooter>
                    <Button className='button-long' onClick={handleSaveClick}>
                        <div className='icon-wrapper'>
                            <span>Save</span>
                            <FontAwesomeIcon icon='save' />
                        </div>
                    </Button>
                    <Button className='button-long' onClick={() => { fullScreenPanelData.closePanel(); }}>
                        <div className='icon-wrapper'>
                            <span>Cancel</span>
                            <FontAwesomeIcon icon='times' />
                        </div>
                    </Button>
                </PanelFooter>
            </div>
        </FullscreenPanelFrame>
    );
}

CreateCustomRollPanel.propTypes = {
    createNew: PropTypes.bool.isRequired,
    index: PropTypes.number,
};

CreateCustomRollPanel.defaultProps = {
    index: null,
}

export default CreateCustomRollPanel; 