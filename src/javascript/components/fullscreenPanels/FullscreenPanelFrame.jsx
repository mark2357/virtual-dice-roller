// modules
import React from 'react';
import PropTypes from 'prop-types';


const FullscreenPanelFrame = (props) => {

    const { className, children } = props;

    return (
        <div className={`fullscreen-panel-background ${className}`}>
            <div className='full-screen-panel-frame'>
                {children}
            </div>
        </div>
    );
}

FullscreenPanelFrame.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

FullscreenPanelFrame.defaultProps = {
    className: '',
};


export default FullscreenPanelFrame;
