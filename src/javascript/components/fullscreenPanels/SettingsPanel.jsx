// modules
import React, { useState, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// components
import Button from '../generics/Button';
import FullscreenPanelFrame from './FullscreenPanelFrame';
import PanelHeader from '../generics/PanelHeader';
import PanelFooter from '../generics/PanelFooter';

// providers
import { PersistentDataContext } from '../providers/PersistentDataProvider';
import { FullScreenPanelContext } from '../providers/FullScreenPanelProvider';

const SettingsPanel = (props) => {


    /**
     * @type {FullScreenPanelData}
     */
    const fullScreenPanelData = useContext(FullScreenPanelContext);

    /**
     * @type {PersistentData}
     */
    const persistentData = useContext(PersistentDataContext);



    const initialSettings = useRef({
        fontSizeMulti: Number.parseFloat(persistentData.settings.fontSizeMulti),
        shadowsEnabled: persistentData.settings.shadowsEnabled,
    } );


    const [fontSizeMulti, setFontSizeMulti] = useState(Number.parseFloat(persistentData.settings.fontSizeMulti));
    const [shadowsEnabled, setShadowsEnabled] = useState(persistentData.settings.shadowsEnabled);
    const [currentFps, setCurrentFps] = useState(0);

    //#region useEffect 

    /**
     * @description
     * sets up initial setting on first render and sets interval
     * removes interval before component unload
     */
    useEffect(() => {
        updateFPS();
        const updateFPSInterval = setInterval(updateFPS, 500);

        return () => {
            clearInterval(updateFPSInterval);
        };
    }, []);

    /**
     * @description
     * saves settings on state change
     */
    useEffect(() => {
        saveSettings();
    }, [fontSizeMulti, shadowsEnabled, currentFps]);



    //#endregion

    /**
     * @description
     * saves the current settings to local storage
     */
    const saveSettings = () => {
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
    const revertSettings = () => {
        persistentData.setSettings(initialSettings.current);
    }

    /**
     * @description
     * updates the fps value from engine and stores value in state
     */
    const updateFPS = () => {
        const { engine } = props;
        if (engine !== null)
            setCurrentFps(engine.getFps().toFixed());
    }

    //#region handler functions

    /**
     * @description
     * handles switching the shadows on and off
     * @param {React.SyntheticEvent} e
     */
    const handleShadowsEnabledChanged = (e) => {
        const value = e.currentTarget.value === 'true';
        setShadowsEnabled(value);
    }

    /**
     * @description
     * handles changing the UI scale
     * @param {React.SyntheticEvent} e
     */
    const handleUISizeChange = (e) => {
        const newFontSizeMulti = Number.parseFloat(e.currentTarget.value);
        setFontSizeMulti(newFontSizeMulti);
    }

    /**
     * @description
     * handles when save button is clicked
     */
    const handleSaveClick = () => {
        saveSettings();
        fullScreenPanelData.closePanel();
    }

    /**
     * @description
     * handles when cancel button is clicked
     */
    const handleCancelClick = () => {
        revertSettings();
        fullScreenPanelData.closePanel();
    }
    
    //#endregion
    
    return (
        <FullscreenPanelFrame>
            <div className='settings-panel'>
                <PanelHeader title='Settings' />
                <div className='content-container'>
                    <div className='performance-wrapper'>
                        <span>Performance Settings</span>
                        <br />
                        <span>{currentFps} fps</span>
                        <div className='shadow-setting-wrapper'>
                            <span>Shadows: </span>
                            <span>On</span>
                            <input className='radio-input'
                                type='radio'
                                name='shadows'
                                value={true}
                                checked={shadowsEnabled}
                                onChange={handleShadowsEnabledChanged}
                            />
                            <span>Off</span>
                            <input
                                className='radio-input'
                                type='radio'
                                name='shadows'
                                value={false}
                                checked={!shadowsEnabled}
                                onChange={handleShadowsEnabledChanged}
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
                            onChange={handleUISizeChange}
                        />
                        <span className='ui-scale-span-right'>{fontSizeMulti.toFixed(2)}</span>
                    </div>

                    <span> Created by: Mark Lenton</span>
                </div>
                <PanelFooter>
                    <Button className='button-long' onClick={handleSaveClick}>
                        <div className='icon-wrapper'>
                            <span>Save</span>
                            <FontAwesomeIcon icon='save' />
                        </div>
                    </Button>
                    <Button className='button-long' onClick={handleCancelClick}>
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

SettingsPanel.propTypes = {
    engine: PropTypes.object,
};

SettingsPanel.defaultProps = {
    engine: null,
}

export default SettingsPanel;