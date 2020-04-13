// modules
import React from 'react';
import PropTypes from 'prop-types';


const FullscreenPanelFrame = (props) => {

    const { children } = props;

    return (
        <div className='fullscreen-panel-background'>
            <div className='full-screen-panel-frame'>
                {children}
            </div>
        </div>
    );
}

FullscreenPanelFrame.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FullscreenPanelFrame;
