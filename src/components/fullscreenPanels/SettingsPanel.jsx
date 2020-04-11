import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from '../generics/Button';
import { CustomRollsDataProps, CustomRollsDataDefaultProps } from '../../propTypes/CustomRollsDataProps';

import { withFullScreenPanelContext } from '../providers/FullScreenPanelProvider';
import { FullScreenPanelDataProps } from '../../propTypes/FullScreenPanelDataProps';
import { FullscreenPanelFrame } from './FullscreenPanelFrame';
import { PanelHeader } from '../generics/PanelHeader';
import { PanelFooter } from '../generics/PanelFooter';

class CreateCustomRollPanel extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { fullScreenPanelData } = this.props;


        return (
            <FullscreenPanelFrame>
                <div className='settings-panel'>
                    {/* <div className='header'>
                        <h2 className='title'> Settings </h2>
                    </div> */}
                    {/* <hr /> */}
                    <PanelHeader title='settings'/>
                    <div className='content-container'>
                     
                    </div>
                    {/* <hr />
                    <div className='footer'> */}
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
            </FullscreenPanelFrame>
        );
    }
}

CreateCustomRollPanel.propTypes = {
    fullScreenPanelData: PropTypes.shape(FullScreenPanelDataProps).isRequired,
};

CreateCustomRollPanel.defaultProps = {
    customRollData: CustomRollsDataDefaultProps,
}

export default withFullScreenPanelContext(CreateCustomRollPanel);