// modules
import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// providers
import { PersistentDataContext } from './providers/PersistentDataProvider';

// components
import Button from './generics/Button';

const DiceButtons = (props) => {

    const hideableButtonRef = useRef(null);

    const [customNumber, setCustomNumber] = useState(1);
    const [buttonsHidden, setButtonsHidden] = useState(false);
    const [buttonsWidth, setButtonsWidth] = useState(0);

    const { onClick } = props;

    
    /**
     * @type {PersistentData}
     */
    const persistentData = useContext(PersistentDataContext);


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
        console.log('getOffset');
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
        if (onClick === 'function') {
            const diceRollArray = Array(numberOfDice).fill(diceSides);
            onClick(diceRollArray);
        }
    };

    /**
     * @description
     * handles changes in the number of dice being rolled
     * @param {boolean} increase 
     */
    const handleCustomNumberChangeClick = (increase) => {

        let newCustomNumber = customNumber;
        if (increase) {
            newCustomNumber++;
        }
        else {
            newCustomNumber--;
        }
        if (newCustomNumber < 1)
            newCustomNumber = 1;
        else if (newCustomNumber > 50)
            newCustomNumber = 50;

        setCustomNumber(newCustomNumber);
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
                <Button onClick={() => { handleCustomNumberChangeClick(true); }} icon='plus' />
                <Button onClick={() => { handleCustomNumberChangeClick(false); }} icon='minus' />
                <Button onClick={() => { handleRollDiceClick(4, customNumber) }}>{customNumber} D4</Button>
                <Button onClick={() => { handleRollDiceClick(6, customNumber) }}>{customNumber} D6</Button>
                <Button onClick={() => { handleRollDiceClick(8, customNumber) }}>{customNumber} D8</Button>
                <Button onClick={() => { handleRollDiceClick(10, customNumber) }}>{customNumber} D10</Button>
                <Button onClick={() => { handleRollDiceClick(12, customNumber) }}>{customNumber} D12</Button>
                <Button onClick={() => { handleRollDiceClick(20, customNumber) }}>{customNumber} D20</Button>
            </div>
        </div>
    );
}

DiceButtons.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default DiceButtons;