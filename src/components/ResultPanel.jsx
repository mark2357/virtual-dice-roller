import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default class ResultPanel extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {resultText, resultPanelVisible, hideResultPanel} = this.props;

        return (
            <div className={`result-panel ${resultPanelVisible ? '' : 'hidden'}`}>
                <div className='result'>
                    <div className='text-container'>
                        {resultText}
                    </div>
                </div>
                <div className='result-close' onClick={hideResultPanel}>
                    <span><FontAwesomeIcon icon='times'/></span>
                </div>
            </div>
        );
    }
}

ResultPanel.propTypes = {  
    resultText: PropTypes.string.isRequired,
    resultPanelVisible: PropTypes.bool.isRequired,
    hideResultPanel: PropTypes.func.isRequired,
};