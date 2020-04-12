import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from '../generics/Button';
import { CustomRollDataDefaultProps } from '../../propTypes/CustomRollDataProps';

import { withFullScreenPanelContext } from '../providers/FullScreenPanelProvider';
import { FullScreenPanelDataProps } from '../../propTypes/FullScreenPanelDataProps';
import { FullscreenPanelFrame } from './FullscreenPanelFrame';
import { PanelHeader } from '../generics/PanelHeader';
import { PanelFooter } from '../generics/PanelFooter';

class CreateCustomRollPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uiScale: 1,
            shadowsEnabled: true,
        };
    }

    /**
     * @description
     * handles switching the shadows on and off
     * @param {React.SyntheticEvent} e
     */
    handleShadowsEnabledChanged = (e) => {
        const value = e.currentTarget.value === 'true';
        this.setState({shadowsEnabled: value});
    }

    /**
     * @description
     * handles changing the UI scale
     * @param {React.SyntheticEvent} e
     */
    handleUISizeChange = (e) => {
        const uiScale = Number.parseFloat(e.currentTarget.value);
        this.setState({uiScale: uiScale});
    }



    render() {

        const { fullScreenPanelData } = this.props;
        const { uiScale, shadowsEnabled } = this.state;

        return (
            <FullscreenPanelFrame>
                <div className='settings-panel'>
                    {/* <div className='header'>
                        <h2 className='title'> Settings </h2>
                    </div> */}
                    {/* <hr /> */}
                    <PanelHeader title='Settings' />
                    <div className='content-container'>
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

                        <div className='ui-scale-wrapper'>
                            <span>UI Scale: </span>
                            <input
                            className='slider-input'
                            type='range'
                            min='0.5'
                            max='1.5'
                            step='0.05'
                            value={uiScale}
                            onChange={this.handleUISizeChange}
                            />
                            <span>{uiScale.toFixed(2)}</span>
                        </div>

                        <span> Created by: Mark Lenton</span>
                    </div>
                    <PanelFooter>
                        <Button className='button-long' onClick={() => { fullScreenPanelData.closePanel(); }}>
                            <div className='icon-wrapper'>
                                <span>Save</span>
                                <FontAwesomeIcon icon='save' />
                            </div>
                        </Button>
                        <Button className='button-long' onClick={() => { fullScreenPanelData.closePanel(); }}>
                            <div className='icon-wrapper'>
                                <span>Cancel</span>
                                <FontAwesomeIcon icon='times' />
                            </div>
                        </Button>
                    </PanelFooter>
                    {/* </div> */}
                </div>
            </FullscreenPanelFrame >
        );
    }
}

CreateCustomRollPanel.propTypes = {
    fullScreenPanelData: PropTypes.shape(FullScreenPanelDataProps).isRequired,
};

CreateCustomRollPanel.defaultProps = {
    customRollData: CustomRollDataDefaultProps,
}

export default withFullScreenPanelContext(CreateCustomRollPanel);