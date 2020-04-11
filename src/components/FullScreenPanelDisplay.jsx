
import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { withFullScreenPanelContext } from './providers/FullScreenPanelProvider';

import { PANEL_TYPES } from '../constants/PanelTypes';
import { FullScreenPanelDataProps } from '../propTypes/FullScreenPanelDataProps';

import CreateCustomRollPanel from './fullscreenPanels/CreateCustomRollPanel';
import SettingsPanel from './fullscreenPanels/SettingsPanel';


class FullScreenPanelDisplay extends Component {


    /**
     * @description
     * returns the panel that is meant to be displayed
     */
    getPanel = () => {
        const { fullScreenPanelData } = this.props;
        switch (fullScreenPanelData.currentPanel) {
            case PANEL_TYPES.CREATE_CUSTOM_ROLL_PANEL:
                return (<CreateCustomRollPanel {...fullScreenPanelData.panelProps} />);
            case PANEL_TYPES.SETTINGS_PANEL:
                return (<SettingsPanel {...fullScreenPanelData.panelProps} />);
            default:
                return null;
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <>
                {this.getPanel()}
            </>
        );
    }
}

FullScreenPanelDisplay.propTypes = {
    fullScreenPanelData: PropTypes.shape(FullScreenPanelDataProps).isRequired,
};


export default withFullScreenPanelContext(FullScreenPanelDisplay);