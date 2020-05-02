// modules
import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// providers
import { PersistentDataContext } from './providers/PersistentDataProvider';
import { FullScreenPanelContext } from './providers/FullScreenPanelProvider';


// components
import Button from './generics/Button';

// constants
import PANEL_TYPES from '../constants/PanelTypes';

const DiceButtons = (props) => {

    const hideableButtonRef = useRef(null);

    const [buttonsHidden, setButtonsHidden] = useState(false);
    const [buttonsWidth, setButtonsWidth] = useState(0);

    const { onClick } = props;

    
    /**
     * @type {PersistentData}
     */
    const persistentData = useContext(PersistentDataContext);

    /**
     * @type {FullScreenPanelData}
     */
    const fullScreenPanelData = useContext(FullScreenPanelContext);


    /** 
     * @description
     * updates button width when the font size multi changes
     */
    useEffect(() => {
        updateButtonsWidth();
        
    }, [persistentData.settings.fontSizeMulti]);


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
    };

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
            return { left: `calc(${-buttonsWidth}px - 1em)` };
        }
    }, [buttonsHidden, buttonsWidth]);

    /**
     * @description
     * calls the onClick function if provided
     * @param {number} diceSides
     * @param {number} numberOfDice
     */
    const handleRollDiceClick = (diceSides, numberOfDice) => {
        if (typeof onClick === 'function') {
            const diceRollArray = Array(numberOfDice).fill(diceSides);
            onClick(diceRollArray);
        }
    };

    /**
     * @description
     * handles the change in button visibility
     */
    const handleChangeVisibilityClick = () => {
        setButtonsHidden(!buttonsHidden);
    };

    return (
        <div className='dice-buttons'>
            <Button
                className='hide-show-button no-shrink'
                onClick={handleChangeVisibilityClick}
                icon={buttonsHidden ? 'chevron-right' : 'chevron-left'}
            />
            <div ref={hideableButtonRef} className='hideable-buttons-container' style={offset}>
                <Button onClick={() => { handleRollDiceClick(4, 1) }}>D4</Button>
                <Button onClick={() => { handleRollDiceClick(6, 1) }}>D6</Button>
                <Button onClick={() => { handleRollDiceClick(8, 1) }}>D8</Button>
                <Button onClick={() => { handleRollDiceClick(10, 1) }}>D10</Button>
                <Button onClick={() => { handleRollDiceClick(12, 1) }}>D12</Button>
                <Button onClick={() => { handleRollDiceClick(20, 1) }}>D20</Button>
                <Button icon='ellipsis-h' onClick={() => { fullScreenPanelData.showPanel(PANEL_TYPES.ROLL_MULTIPLE_DICE_PANEL, {rollDiceClick: onClick}) }} />
            </div>
        </div>
    );
}

DiceButtons.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default DiceButtons;