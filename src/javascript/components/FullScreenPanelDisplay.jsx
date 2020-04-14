
import React from 'react';
import PropTypes from 'prop-types';


import { withFullScreenPanelContext } from './providers/FullScreenPanelProvider';

import PANEL_TYPES from '../constants/PanelTypes';
import { FullScreenPanelDataProps } from '../propTypes/FullScreenPanelDataProps';

import CreateCustomRollPanel from './fullscreenPanels/CreateCustomRollPanel';
import SettingsPanel from './fullscreenPanels/SettingsPanel';
import SelectEditCustomRollPanel from './fullscreenPanels/SelectEditCustomRollPanel';

const FullScreenPanelDisplay = (props) => {

    const { fullScreenPanelData } = props;
    /**
     * @description
     * returns the panel that is meant to be displayed
     */
    const getPanel = () => {
        switch (fullScreenPanelData.currentPanel) {
            case PANEL_TYPES.CREATE_CUSTOM_ROLL_PANEL:
                return (<CreateCustomRollPanel {...fullScreenPanelData.panelProps} />);
            case PANEL_TYPES.SETTINGS_PANEL:
                return (<SettingsPanel {...fullScreenPanelData.panelProps} />);
                case PANEL_TYPES.SELECT_EDIT_CUSTOM_ROLL_PANEL:
                    return (<SelectEditCustomRollPanel {...fullScreenPanelData.panelProps} />);
                    
            default:
                return null;
        }
    }

    return (
        <>
            {getPanel()}
        </>
    );

}

FullScreenPanelDisplay.propTypes = {
    fullScreenPanelData: PropTypes.shape(FullScreenPanelDataProps).isRequired,
};


export default withFullScreenPanelContext(FullScreenPanelDisplay);