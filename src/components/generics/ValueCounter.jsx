import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import '../../css/generics/ValueCounter.scss';

export const ValueCounter = (props) => {
    const {className, children, onClick} = props;

    /**
     * @description
     * handles when the up or down value buttons are pressed
     * @param {number} deltaValue -1 for decrement and 1 for increment
     * 
     */
    const handleValueChange = (deltaValue) => {
        if(typeof onClick === 'function') {
            onClick(deltaValue);
        }
    };

    return (
        <div className={`value-counter ${className}`}>
            <Button className='half-height' onClick={() => {handleValueChange(1)}}>
                <FontAwesomeIcon icon='chevron-up' />
            </Button>
            <div className='value-container'>
                {children}
            </div>
            <Button className='half-height' onClick={() => {handleValueChange(-1)}}>
            <FontAwesomeIcon icon='chevron-down' />
            </Button>
        </div>
    );
}

ValueCounter.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
};

ValueCounter.defaultProps = {
    className: '',
    children: PropTypes.null,
}