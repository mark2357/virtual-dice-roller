import React from 'react';
import PropTypes from 'prop-types';


import '../../css/generics/button.css';

export const Button = (props) => {
    const { className, children, onClick } = props;
    return (
        <button className={`button ${className}` } onClick={onClick}>
            {children}
        </button>
    );
}

Button.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
};

Button.defaultProps = {
    className: '',
    children: null,
    onClick: null,
}