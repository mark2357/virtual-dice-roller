// modules
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// components
import Button from '../generics/Button';
import FullscreenPanelFrame from './FullscreenPanelFrame';
import PanelHeader from '../generics/PanelHeader';
import PanelFooter from '../generics/PanelFooter';

// proptypes
import { FullScreenPanelDataProps } from '../../propTypes/FullScreenPanelDataProps';
import { PersistentDataProps } from '../../propTypes/PersistentDataProps';

// providers
import { withFullScreenPanelContext } from '../providers/FullScreenPanelProvider';
import { withPersistentDataContext } from '../providers/PersistentDataProvider';

//constants
import PANEL_TYPES from '../../constants/PanelTypes';


class SelectEditCustomRollPanel extends Component {

    /**
     * @description
     * changes the visibility of a custom roll
     * @param {number} index the index of the custom roll in the custom roll array
     */
    handleEditCustomRoll = (index) => {
        const { fullScreenPanelData} = this.props;
        fullScreenPanelData.showPanel(PANEL_TYPES.CREATE_CUSTOM_ROLL_PANEL, {createNew: false, index});
    }


    /**
     * @description
     * changes the visibility of a custom roll
     * @param {number} index the index of the custom roll in the custom roll array
     */
    handleChangeCustomRollVisibility = (index) => {
        const { persistentData } = this.props;
        const newCustomRollsData = [...persistentData.customRollsData];
        newCustomRollsData[index].hidden = !newCustomRollsData[index].hidden;
        persistentData.setCustomDiceRolls(newCustomRollsData);
    }

    /**
     * @description
     */
    getButtons = () => {
        const { persistentData } = this.props;
        const { customRollsData } = persistentData;

        let buttonRows = [];

        customRollsData.forEach((customRoll, index) => {
            buttonRows.push(
                <div className='custom-roll-row' key={index}>
                    <Button
                        className='button-long name-button'
                        onClick={() => { this.handleEditCustomRoll(index); }}
                    >
                        <span>{customRoll.name}</span>
                    </Button>
                    <Button
                        icon={customRoll.hidden ? 'eye-slash' : 'eye'}
                        onClick={() => { this.handleChangeCustomRollVisibility(index); }}
                    />
                </div>
            );

        });

        return buttonRows;

    }

    render() {
        const { fullScreenPanelData } = this.props;

        return (
            <FullscreenPanelFrame>
                <div className='select-edit-custom-roll-panel'>
                    <PanelHeader
                        title='Select Custom Roll'
                    />
                    <div className='content-container'>
                        {this.getButtons()}
                    </div>
                    <PanelFooter>
                        <Button className='button-long' onClick={() => { fullScreenPanelData.closePanel(); }}>
                            <div className='icon-wrapper'>
                                <span>Close</span>
                                <FontAwesomeIcon icon='times' />
                            </div>
                        </Button>
                        <Button className='button-long' onClick={() => { fullScreenPanelData.showPanel(PANEL_TYPES.CREATE_CUSTOM_ROLL_PANEL, {createNew: true}); }}>
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
}

SelectEditCustomRollPanel.propTypes = {
    fullScreenPanelData: PropTypes.shape(FullScreenPanelDataProps).isRequired,
    persistentData: PropTypes.shape(PersistentDataProps).isRequired,
};


export default withPersistentDataContext(withFullScreenPanelContext(SelectEditCustomRollPanel)); 