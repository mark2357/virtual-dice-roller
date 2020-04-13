import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from '../generics/Button';

import { PersistentDataProps } from '../../propTypes/PersistentDataProps';
import { withPersistentDataContext } from '../providers/PersistentDataProvider';

import { withFullScreenPanelContext } from '../providers/FullScreenPanelProvider';
import { FullScreenPanelDataProps } from '../../propTypes/FullScreenPanelDataProps';
import { FullscreenPanelFrame } from './FullscreenPanelFrame';
import { PanelHeader } from '../generics/PanelHeader';
import { PanelFooter } from '../generics/PanelFooter';

class SettingsPanel extends Component {

    constructor(props) {
        super(props);

        const { settings } = this.props.persistentData;

        this.state = {
            fontSizeMulti: Number.parseFloat(settings.fontSizeMulti),
            shadowsEnabled: settings.shadowsEnabled,
            currentFps: 0,
        };

        // saves the initial settings incase cancel is pressed and they need to be reverted
        this.initialSettings = JSON.parse(JSON.stringify(settings));

        this.updateFPSInterval = null;
    }


    componentDidMount() {
        this.updateFPS();
        this.updateFPSInterval = setInterval(this.updateFPS, 500);
    }

    componentWillUnmount() {
        clearInterval(this.updateFPSInterval);
    }

    /**
     * @description
     * saves the current settings to local storage
     */
    saveSettings = () => {
        const { persistentData } = this.props;
        const { fontSizeMulti, shadowsEnabled } = this.state
        const settings = {
            fontSizeMulti,
            shadowsEnabled,
        };
        persistentData.setSettings(settings);
    }

    /**
     * @description
     * reverts the settings to there state before the panel was opened
     */
    revertSettings = () => {
        const { persistentData } = this.props;
        persistentData.setSettings(this.initialSettings);
    }


    updateFPS = () => {
        const { engine } = this.props;
        if(engine !== null)
            this.setState({currentFps: engine.getFps().toFixed()});
    }

    /**
     * @description
     * handles switching the shadows on and off
     * @param {React.SyntheticEvent} e
     */
    handleShadowsEnabledChanged = (e) => {
        const value = e.currentTarget.value === 'true';
        this.setState({ shadowsEnabled: value }, this.saveSettings);
    }

    /**
     * @description
     * handles changing the UI scale
     * @param {React.SyntheticEvent} e
     */
    handleUISizeChange = (e) => {
        const fontSizeMulti = Number.parseFloat(e.currentTarget.value);
        this.setState({ fontSizeMulti: fontSizeMulti }, this.saveSettings);
    }

    /**
     * @description
     * handles when save button is clicked
     */
    handleSaveClick = () => {
        const { fullScreenPanelData } = this.props;
        this.saveSettings();
        fullScreenPanelData.closePanel();
    }

    /**
     * @description
     * handles when cancel button is clicked
     */
    handleCancelClick = () => {
        const { fullScreenPanelData } = this.props;
        this.revertSettings();
        fullScreenPanelData.closePanel();
    }


    render() {
        const { fontSizeMulti, shadowsEnabled, currentFps } = this.state;

        return (
            <FullscreenPanelFrame>
                <div className='settings-panel'>
                    <PanelHeader title='Settings' />
                    <div className='content-container'>
                        <div className='performance-wrapper'>
                            <span>Performance Settings</span>
                                <span>{currentFps} fps</span>
                            <div className='shadow-setting-wrapper'>
                                <span>Shadows: </span>
                                <span>On</span>
                                <input className='radio-input'
                                    type='radio'
                                    name='shadows'
                                    value={true}
                                    checked={shadowsEnabled}
                                    onChange={this.handleShadowsEnabledChanged}
                                />
                                <span>Off</span>
                                <input
                                    className='radio-input'
                                    type='radio'
                                    name='shadows'
                                    value={false}
                                    checked={!shadowsEnabled}
                                    onChange={this.handleShadowsEnabledChanged}
                                />
                            </div>
                        </div>
                        <div className='ui-scale-wrapper'>
                            <span className='ui-scale-span-left'>UI Scale: </span>
                            <input
                                className='slider-input'
                                type='range'
                                min='0.5'
                                max='1.5'
                                step='0.01'
                                value={fontSizeMulti}
                                onChange={this.handleUISizeChange}
                            />
                            <span className='ui-scale-span-right'>{fontSizeMulti.toFixed(2)}</span>
                        </div>

                        <span> Created by: Mark Lenton</span>
                    </div>
                    <PanelFooter>
                        <Button className='button-long' onClick={this.handleSaveClick}>
                            <div className='icon-wrapper'>
                                <span>Save</span>
                                <FontAwesomeIcon icon='save' />
                            </div>
                        </Button>
                        <Button className='button-long' onClick={this.handleCancelClick}>
                            <div className='icon-wrapper'>
                                <span>Cancel</span>
                                <FontAwesomeIcon icon='times' />
                            </div>
                        </Button>
                    </PanelFooter>
                </div>
            </FullscreenPanelFrame >
        );
    }
}

SettingsPanel.propTypes = {
    engine: PropTypes.object,
    fullScreenPanelData: PropTypes.shape(FullScreenPanelDataProps).isRequired,
    persistentData: PropTypes.shape(PersistentDataProps).isRequired,
};

SettingsPanel.defaultProps = {
    engine: null,
}

export default withPersistentDataContext(withFullScreenPanelContext(SettingsPanel));