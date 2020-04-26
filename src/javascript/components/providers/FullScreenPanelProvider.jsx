// modules
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//constants
import PANEL_TYPES from '../../constants/PanelTypes';


const FullScreenPanelContext = React.createContext();

class FullScreenPanelProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // which full screen panel component to show, null is to not show any
            fullScreenPanelType: null,
            panelProps: null,
        }
    }

    /**
     * @description
     * displays the given panel type and passes through the given props
     * @param {string} panelType
     * @param {object} panelProps
     */
    showPanel = (panelType, panelProps) => {

        switch (panelType) {
            case PANEL_TYPES.CREATE_CUSTOM_ROLL_PANEL:
                this.setState({ fullScreenPanelType: panelType, panelProps });
                break;
            case PANEL_TYPES.SETTINGS_PANEL:
                this.setState({ fullScreenPanelType: panelType, panelProps });
                break;
            case PANEL_TYPES.SELECT_EDIT_CUSTOM_ROLL_PANEL:
                this.setState({ fullScreenPanelType: panelType, panelProps });
                break;
            default:
                console.error(`${panelType} is not implemented yet`);
                break;
        }
    }

    /**
     * @description
     * hides the current fullscreen panel
     */
    closePanel = () => {
        const { fullScreenPanelType } = this.state;
        if (fullScreenPanelType !== null)
            this.setState({ fullScreenPanelType: null });
    }

    render() {
        const { children } = this.props;
        const { fullScreenPanelType, panelProps } = this.state

        return (
            <>
                <FullScreenPanelContext.Provider
                    value={{
                        showPanel: this.showPanel,
                        closePanel: this.closePanel,
                        currentPanel: fullScreenPanelType,
                        panelProps: panelProps
                    }}
                >
                    {children}
                </FullScreenPanelContext.Provider>
            </>
        );
    }
}

FullScreenPanelProvider.propTypes = {
    children: PropTypes.node.isRequired,
};


// used to allow components to have context data added to props without having to use the consumer in the parent component
// e.g. export default withPersistentDataContext(buttonComponent);
const withFullScreenPanelContext = (Component) => {
    // eslint-disable-next-line react/display-name
    return props => (
        <FullScreenPanelContext.Consumer>
            {value => {
                return <Component {...props} fullScreenPanelData={value} />;
            }
            }
        </FullScreenPanelContext.Consumer>
    );
}

export { FullScreenPanelProvider, FullScreenPanelContext, withFullScreenPanelContext };