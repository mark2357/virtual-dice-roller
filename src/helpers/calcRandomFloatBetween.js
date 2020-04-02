/**
 * @description
 * calculates a random float between the passed in min and max values
 * @param {number} floatMin
 * @param {number} floatMax
 */
const calcRandomFloatBetween = (floatMin, floatMax) => {
    return floatMin + (Math.random() * (floatMax - floatMin));
}

export default calcRandomFloatBetween;