//modules
import React, { useRef, useState, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';


// providers
import { FullScreenPanelContext } from './providers/FullScreenPanelProvider';
import { PersistentDataContext } from './providers/PersistentDataProvider';

//constants
import PANEL_TYPES from '../constants/PanelTypes';

// components
import Button from './generics/Button';


const CustomDiceRolls = (props) => {

    const { onDiceRollClick } = props;

    const hideableButtonRef = useRef(null);

    const [buttonsHidden, setButtonsHidden] = useState(false);
    const [buttonsWidth, setButtonsWidth] = useState(0);

    /**
     * @type {FullScreenPanelData}
     */
    const fullScreenPanelData = useContext(FullScreenPanelContext);

    /**
     * @type {PersistentData}
     */
    const persistentData = useContext(PersistentDataContext);
    const { customRollsData } = persistentData;

    /** 
     * @description
     * updates button width when the font size multi changes
     */
    useEffect(() => {
        updateButtonsWidth();

    }, [persistentData.settings.fontSizeMulti, persistentData.customRollsData]);

    /**
     * @description
     * adds listener when components loads and removes listener when component unloads
     */
    useEffect(() => {

        // onload
        updateButtonsWidth();
        window.addEventListener('resize', updateButtonsWidth);

        //on unload
        return () => {
            window.removeEventListener('resize', updateButtonsWidth);
        };
    }, []);

    /**
     * @description
     * handles when the browser window resizes
     */
    const updateButtonsWidth = () => {
        if (hideableButtonRef.current !== null) {
            setButtonsWidth(hideableButtonRef.current.scrollWidth);
        }
    }

    /**
     * @description
     * calls the onClick function if provided
     * @param {Array<number>} diceRollArray
     * @param {string} customResultCalculation
     */
    const handleRollDiceClick = (diceRollArray, customResultCalculation) => {
        if (typeof onDiceRollClick === 'function') {
            onDiceRollClick(diceRollArray, customResultCalculation);
        }
    }

    /**
     * @description
     * handles the change in button visibility
     */
    const handleChangeVisibilityClick = () => {
        setButtonsHidden(!buttonsHidden);
    }

    /**
     * @description
     * returns the style for the hideable buttons container
     * @returns { {left: number} }
     */
    const offset = useMemo(() => {
        if (buttonsHidden === false) {
            return {};
        }
        else {
            return { marginRight: `calc(${-buttonsWidth}px - 1em)` };
        }
    }, [buttonsHidden, buttonsWidth]);


    // creates custom roll buttons
    const customRollButtons = [];
    customRollsData.forEach((customRollData, index) => {
        if (!customRollData.hidden) {
            customRollButtons.push(
                <div className='custom-roll-row' key={index}>
                    <Button
                        className='button-long'
                        onClick={() => { handleRollDiceClick(customRollData.diceRollArray, customRollData.customResultCalculation); }}
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
                onClick={handleChangeVisibilityClick}
                icon={buttonsHidden ? 'chevron-left' : 'chevron-right'}
            />
            <div ref={hideableButtonRef} className='hideable-buttons-container' style={offset}>
                <div className='edit-buttons-row'>
                    <Button icon='edit' onClick={() => { fullScreenPanelData.showPanel(PANEL_TYPES.SELECT_EDIT_CUSTOM_ROLL_PANEL); }} />
                </div>
                <Button className='button-long' onClick={() => { handleRollDiceClick([20, 20], 'MAX(@D, @D)'); }}><span>Roll Advantage</span></Button>
                <Button className='button-long' onClick={() => { handleRollDiceClick([20, 20], 'MIN(@D, @D)'); }}><span>Roll Disadvantage</span></Button>
                {customRollButtons}
            </div>
        </div>
    );
}

CustomDiceRolls.propTypes = {
    onDiceRollClick: PropTypes.func.isRequired,
};


export default CustomDiceRolls;