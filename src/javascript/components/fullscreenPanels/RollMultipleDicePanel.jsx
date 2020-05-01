// modules
import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';


// components
import Button from '../generics/Button';
import FullscreenPanelFrame from './FullscreenPanelFrame';
import PanelHeader from '../generics/PanelHeader';
import PanelFooter from '../generics/PanelFooter';

// providers
import { FullScreenPanelContext } from '../providers/FullScreenPanelProvider';


const RollMultipleDicePanel = (props) => {

    const maxPageNumber = 5;

    const { rollDiceClick } = props;

    /**
     * @type {FullScreenPanelData}
     */
    const fullScreenPanelData = useContext(FullScreenPanelContext);


    const [pageNumber, setPageNumber] = useState(0);

    /**
     * @description
     * handles the click on the buttons
     * @param { number } diceToRoll the number of sides the dice to roll
     * @param { number } numberOfDice the number of dice to roll
     */
    const handleOnClick = (diceToRoll, numberOfDice) => {
        const diceArray = [...Array(numberOfDice).fill(diceToRoll)];
        rollDiceClick(diceArray);
        fullScreenPanelData.closePanel();
    };

    /**
     * @description
     * @param { number } pageDelta the change in pageNumber
     */
    const handlePageChange = (pageDelta) => {
        const newPageNumber = Math.min(Math.max(0, pageNumber + pageDelta), 4);
        setPageNumber(newPageNumber);
    };


    /**
     * @description
     * returns the buttons to be displayed
     * @returns {React.Component}
     */
    const getButtons = () => {
        const buttons = [];

        const diceRollArray = [4, 6, 8, 10, 12, 20];

        for (let i = 0; i < diceRollArray.length; i++) {
            const buttonsRow = [];
            for (let j = 1 + pageNumber * 5; j <= maxPageNumber + pageNumber * 5; j++) {
                buttonsRow.push(
                    <Button
                        key={`${i} ${j}`}
                        onClick={() => { handleOnClick(diceRollArray[i], j) }}
                    >
                        {`${j} D${diceRollArray[i]}`}
                    </Button>
                );
            }
            buttons.push(
                <div
                    className='button-row'
                    key={`row ${i}`}
                >
                    {buttonsRow}
                </div>
            );
        }

        return buttons;
    }

    return (
        <FullscreenPanelFrame className='roll-multiple-dice-panel-background'>
            <div className='roll-multiple-dice-panel'>
                <PanelHeader
                    title='Select Dice'
                />
                <div className='content-container'>
                    {getButtons()}
                </div>
                <PanelFooter>
                    <Button className='button-long' onClick={() => { fullScreenPanelData.closePanel(); }}>
                        <div className='icon-wrapper'>
                            <span>Close</span>
                            <FontAwesomeIcon icon='times' />
                        </div>
                    </Button>
                    <Button className='button-long' onClick={() => { handlePageChange(-1); }} disabled={pageNumber === 0}>
                        <div className='icon-wrapper'>
                            <span className='hiding-text'>Prev Page</span>
                            <FontAwesomeIcon icon='chevron-left' />
                        </div>
                    </Button>
                    <Button className='button-long' onClick={() => { handlePageChange(1); }} disabled={pageNumber === maxPageNumber - 1 }>
                        <div className='icon-wrapper'>
                            <span className='hiding-text'>Next Page</span>
                            <FontAwesomeIcon icon='chevron-right' />
                        </div>
                    </Button>
                </PanelFooter>
            </div>
        </FullscreenPanelFrame>
    );
}


RollMultipleDicePanel.propTypes = {
    rollDiceClick: PropTypes.func.isRequired,
};


export default RollMultipleDicePanel;