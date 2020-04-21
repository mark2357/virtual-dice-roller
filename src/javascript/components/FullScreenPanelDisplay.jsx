// modules
import React, { useContext } from 'react';

// providers
import { FullScreenPanelContext } from './providers/FullScreenPanelProvider';

// constants
import PANEL_TYPES from '../constants/PanelTypes';

//components
import CreateCustomRollPanel from './fullscreenPanels/CreateCustomRollPanel';
import SettingsPanel from './fullscreenPanels/SettingsPanel';
import SelectEditCustomRollPanel from './fullscreenPanels/SelectEditCustomRollPanel';


const FullScreenPanelDisplay = () => {

    /**
     * @type {FullScreenPanelData}
     */
    const fullScreenPanelData = useContext(FullScreenPanelContext);

    
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

export default FullScreenPanelDisplay;