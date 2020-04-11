
import PropTypes from 'prop-types';


export const CustomRollsDataProps = {
    name: PropTypes.string.isRequired,
    diceRollArray: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    customResultCalculation: PropTypes.string.isRequired,
};


export const CustomRollsDataDefaultProps = {
    name: '',
    diceRollArray: [],
    customResultCalculation: '',
};