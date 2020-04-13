//modules
import React from 'react';
import PropTypes from 'prop-types';

// components
import Button from './Button';


const ValueCounter = (props) => {
    const { className, children, onClick } = props;

    /**
     * @description
     * handles when the up or down value buttons are pressed
     * @param {number} deltaValue -1 for decrement and 1 for increment
     * 
     */
    const handleValueChange = (deltaValue) => {
        if (typeof onClick === 'function') {
            onClick(deltaValue);
        }
    };

    return (
        <div className={`value-counter ${className}`}>
            <Button
                className='half-height'
                onClick={() => { handleValueChange(1) }}
                icon='chevron-up'
            />
            <div className='value-container'>
                {children}
            </div>
            <Button
                className='half-height'
                onClick={() => { handleValueChange(-1) }}
                icon='chevron-down'
            />
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

export default ValueCounter;