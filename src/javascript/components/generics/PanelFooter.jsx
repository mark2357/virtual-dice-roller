// modules
import React from 'react';
import PropTypes from 'prop-types';


const PanelFooter = (props) => {
    const { className, children } = props;

    return (
        <>
            <hr className='panel-footer-hr' />
            <div className={`panel-footer ${className}`}>
                {children}
            </div>
        </>
    );
}

PanelFooter.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
};

PanelFooter.defaultProps = {
    className: '',
    children: null,
}

export default PanelFooter;