
import PropTypes from 'prop-types';


export const CustomRollDataProps = {
    name: PropTypes.string.isRequired,
    diceRollArray: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    customResultCalculation: PropTypes.string.isRequired,
};


export const CustomRollDataDefaultProps = {
    name: '',
    diceRollArray: [],
    customResultCalculation: '',
};