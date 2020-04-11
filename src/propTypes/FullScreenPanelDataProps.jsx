
import PropTypes from 'prop-types';

export const FullScreenPanelDataProps = {
    showPanel: PropTypes.func.isRequired,
    closePanel: PropTypes.func.isRequired,
    currentPanel: PropTypes.string,
    panelProps: PropTypes.object,
};

export const FullScreenPanelDataDefaultProps = {
    currentPanel: null,
    panelProps: null,
};