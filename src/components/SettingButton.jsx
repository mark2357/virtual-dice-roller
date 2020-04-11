import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from './generics/Button';
import { withFullScreenPanelContext } from './providers/FullScreenPanelProvider';
import { FullScreenPanelDataProps } from '../propTypes/FullScreenPanelDataProps';
import { PANEL_TYPES } from '../constants/PanelTypes';

const SettingsButton = (props) => {
    const { fullScreenPanelData } = props;

    const handleOnClick = () => {
        fullScreenPanelData.showPanel(PANEL_TYPES.SETTINGS_PANEL, null);
    };

    return (
            <Button
            className='settings-button no-shrink'
            icon='cog'
            onClick={handleOnClick}
            />
    );
}

SettingsButton.propTypes = {
    fullScreenPanelData: PropTypes.shape(FullScreenPanelDataProps).isRequired,
};



export default withFullScreenPanelContext(SettingsButton);