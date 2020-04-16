// modules
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = (props) => {
    const { className, children, onClick, icon, disabled } = props;

    return (
        <button className={`button ${className} ${disabled ? 'disabled' : ''}` } disabled={disabled} onClick={onClick}>
            {children}
            {icon !== null && (
                <FontAwesomeIcon className='icon' icon={icon} />
            )}
        </button>
    );
}

Button.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
    icon: PropTypes.string,
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    className: '',
    children: null,
    onClick: null,
    icon: null,
    disabled: false,
}

export default Button;