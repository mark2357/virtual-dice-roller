// modules
import React from 'react';
import PropTypes from 'prop-types';
import PanelFooter from './PanelFooter';


const PanelHeader = (props) => {
    const { className, children, title } = props;

    return (
        <>
            <div className={`panel-header ${className}`}>
                {children}
                <h2 className='title'>{title}</h2>
            </div>
            <hr className='panel-header-hr'/>
        </>
    );
}

PanelHeader.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    title: PropTypes.string,
};

PanelHeader.defaultProps = {
    className: '',
    children: null,
    title: '',
}

export default PanelFooter;