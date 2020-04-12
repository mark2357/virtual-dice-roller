
import PropTypes from 'prop-types';
import { CustomRollDataProps } from './CustomRollDataProps'; 
import { SettingsProps } from './SettingsProps'; 

export const PersistentDataProps = {
    settings: PropTypes.shape(SettingsProps),
    customRollsData: PropTypes.arrayOf(PropTypes.shape(CustomRollDataProps)),
};


export const PersistentDataDefaultProps = {
};