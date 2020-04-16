// modules
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * @description
 * as the camera reset icon is a combination of 2 different components
 * @param {*} props 
 */
const CameraResetIcon = (props) => {
    const { className } = props;

    return (
        <div className={`camera-reset-icon ${className}`}>
            <FontAwesomeIcon className='icon-camera' icon='camera' />
            <FontAwesomeIcon className='icon-reset' icon='sync-alt' />
        </div>
    );
}

CameraResetIcon.propTypes = {
    className: PropTypes.string,
};

CameraResetIcon.defaultProps = {
    className: '',
}

export default CameraResetIcon;