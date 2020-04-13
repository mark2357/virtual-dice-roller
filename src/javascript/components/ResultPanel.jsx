// modules
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ResultPanel = (props) => {

    const {
        resultText,
        resultPanelVisible,
        hideResultPanel
    } = props;

    return (
        <div className={`result-panel ${resultPanelVisible ? '' : 'hidden'}`}>
            <div className='result'>
                <div className='text-container'>
                    {resultText}
                </div>
            </div>
            <div className='result-close' onClick={hideResultPanel}>
                <span><FontAwesomeIcon icon='times' /></span>
            </div>
        </div>
    );
}

ResultPanel.propTypes = {
    resultText: PropTypes.string.isRequired,
    resultPanelVisible: PropTypes.bool.isRequired,
    hideResultPanel: PropTypes.func.isRequired,
};

export default ResultPanel;