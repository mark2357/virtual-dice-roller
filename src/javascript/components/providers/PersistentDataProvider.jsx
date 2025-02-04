// modules
import React, { Component } from 'react';
import PropTypes from 'prop-types';


const PersistentDataContext = React.createContext();

class PersistentDataProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            settings: this._loadSettings(),
            customRollsData: this._loadCustomDiceRolls(),
        }
    }

    /**
     * @description
     * saves the settings from state to local storage
     */
    _saveSettings = () => {
        const {settings} = this.state;
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    /**
     * @description
     * loads the local settings from local storage and returns the object
     * @returns {{ shadowsEnabled: boolean, fontSizeMulti: number}}
     */
    _loadSettings = () => {
        const jsonData = localStorage.getItem('settings');
        let data = null;
        if (jsonData !== null) {
            data = JSON.parse(jsonData);
        }

        const defaultSettings = {
            shadowsEnabled: true,
            fontSizeMulti: 1,
        };
        
        const settings = {...defaultSettings, ...data};

        // checks to make sure data is the correct type
        if(typeof settings.shadowsEnabled !== 'boolean') settings.shadowsEnabled = defaultSettings.shadowsEnabled;
        if(typeof settings.fontSizeMulti !== 'number') settings.fontSizeMulti = defaultSettings.fontSizeMulti;

        return settings;
    }

    /**
     * @description
     * saves the custom dice rolls from state to local storage
     */
    _saveCustomDiceRolls() {
        const {customRollsData} = this.state;
        localStorage.setItem('customRolls', JSON.stringify(customRollsData));
    }

    /**
     * @description
     * loads the custom dice rolls from local storage and returns the array of objects
     * @returns {Array<{ name: string, diceRollArray: Array<number>, customResultCalculation: string, hidden: boolean}>}
     */
    _loadCustomDiceRolls = () => {
        const jsonData = localStorage.getItem('customRolls');
        let data = null;
        if (jsonData !== null) {
            data = JSON.parse(jsonData);

            const defaultCustomDiceRoll = {
                name: 'Custom Dice Roll',
                diceRollArray: [20],
                customResultCalculation: '@D',
                hidden: false,
            };

            for(let i = 0; i < data.length; i++) {
                let customDiceRoll = data[i];
                customDiceRoll = {...defaultCustomDiceRoll, ...customDiceRoll}

                // checks to make sure data is the correct type
                if(typeof customDiceRoll.name !== 'string') customDiceRoll.name = defaultCustomDiceRoll.name;
                if(Array.isArray(customDiceRoll.diceRollArray) === false || !customDiceRoll.diceRollArray.every((num) => typeof num === 'number' )) customDiceRoll.diceRollArray = defaultCustomDiceRoll.diceRollArray;
                if(typeof customDiceRoll.customResultCalculation !== 'string') customDiceRoll.customResultCalculation = defaultCustomDiceRoll.customResultCalculation;
                if(typeof customDiceRoll.hidden !== 'boolean') customDiceRoll.hidden = defaultCustomDiceRoll.hidden;

                
                data[i] = customDiceRoll;
            }
            return data;
        }
        return [];
    }

    /**
     * @description
     * sets the settings to state and saves the new values to local storage
     * @param {Array<{ name: string, diceRollArray: Array<number>, customResultCalculation: string, hidden: boolean}>} settings
     */
    setSettings = (settings) => {
        this.setState({settings}, () => {
            this._saveSettings();
        });

    }

    /**
     * @description
     * sets the custom dice rolls to state and saves the new values to local storage
     * @param {{ shadowsEnabled: boolean, fontSizeMulti: number}} customDiceRolls
     */
    setCustomDiceRolls = (customRollsData) => {
        this.setState({customRollsData}, () => {
            this._saveCustomDiceRolls();
        });
    }

    render() {
        const { children } = this.props;
        const { settings, customRollsData } = this.state;

        return (
            <>
                <PersistentDataContext.Provider
                    value={{
                        settings: settings,
                        customRollsData: customRollsData,
                        setSettings: this.setSettings,
                        setCustomDiceRolls: this.setCustomDiceRolls,
                    }}
                >
                    {children}
                </PersistentDataContext.Provider>
            </>
        );
    }
}

PersistentDataProvider.propTypes = {
    children: PropTypes.node.isRequired,
};


// used to allow components to have context data added to props without having to use the consumer in the parent component
// e.g. export default withPersistentDataContext(buttonComponent);
const withPersistentDataContext = (Component) => {
    // eslint-disable-next-line react/display-name
    return props => (
        <PersistentDataContext.Consumer>
            { value => {
                return <Component {...props} persistentData={value}/>;
            }
            }
        </PersistentDataContext.Consumer>
    );
}

export {PersistentDataProvider, PersistentDataContext, withPersistentDataContext};