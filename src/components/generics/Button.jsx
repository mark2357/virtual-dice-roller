import React from 'react';
import PropTypes from 'prop-types';


import '../../css/generics/button.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Button = (props) => {
    const { className, children, onClick, icon } = props;

    return (
        <button className={`button ${className}` } onClick={onClick}>
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
};

Button.defaultProps = {
    className: '',
    children: null,
    onClick: null,
    icon: null,
}