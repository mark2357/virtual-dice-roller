// modules
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// components
import Button from '../generics/Button';
import FullscreenPanelFrame from './FullscreenPanelFrame';
import PanelHeader from '../generics/PanelHeader';
import PanelFooter from '../generics/PanelFooter';

// providers
import { FullScreenPanelContext } from '../providers/FullScreenPanelProvider';
import { PersistentDataContext } from '../providers/PersistentDataProvider';

//constants
import PANEL_TYPES from '../../constants/PanelTypes';




const SelectEditCustomRollPanel = () => {

    /**
     * @type {FullScreenPanelData}
     */
    const fullScreenPanelData = useContext(FullScreenPanelContext);

    /**
     * @type {PersistentData}
     */
    const persistentData = useContext(PersistentDataContext);

    /**
     * @description
     * changes the visibility of a custom roll
     * @param {number} index the index of the custom roll in the custom roll array
     */
    const handleEditCustomRoll = (index) => {
        fullScreenPanelData.showPanel(PANEL_TYPES.CREATE_CUSTOM_ROLL_PANEL, { createNew: false, index });
    }

    /**
     * @description
     * changes the visibility of a custom roll
     * @param {number} index the index of the custom roll in the custom roll array
     */
    const handleChangeCustomRollVisibility = (index) => {
        const newCustomRollsData = [...persistentData.customRollsData];
        newCustomRollsData[index].hidden = !newCustomRollsData[index].hidden;
        persistentData.setCustomDiceRolls(newCustomRollsData);
    }

    /**
     * @description
     * returns the buttons to be displayed
     * @returns {React.Component}
     */
    const getButtons = () => {
        const { customRollsData } = persistentData;

        let buttonRows = [];

        customRollsData.forEach((customRoll, index) => {
            buttonRows.push(
                <div className='custom-roll-row' key={index}>
                    <Button
                        className='button-long name-button'
                        onClick={() => { handleEditCustomRoll(index); }}
                    >
                        <span>{customRoll.name}</span>
                    </Button>
                    <Button
                        icon={customRoll.hidden ? 'eye-slash' : 'eye'}
                        onClick={() => { handleChangeCustomRollVisibility(index); }}
                    />
                </div>
            );

        });

        return buttonRows;

    }

    return (
        <FullscreenPanelFrame>
            <div className='select-edit-custom-roll-panel'>
                <PanelHeader
                    title='Select Custom Roll'
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
                    <Button className='button-long' onClick={() => { fullScreenPanelData.showPanel(PANEL_TYPES.CREATE_CUSTOM_ROLL_PANEL, { createNew: true }); }}>
                        <div className='icon-wrapper'>
                            <span>New</span>
                            <FontAwesomeIcon icon='plus' />
                        </div>
                    </Button>
                </PanelFooter>
            </div>
        </FullscreenPanelFrame>
    );
}

export default SelectEditCustomRollPanel;