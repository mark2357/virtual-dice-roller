/**
 * @description
 * calculates the result string of a custom roll calculation
 * @param {Array<number>} diceRollArray 
 * @param {string} customResultCalculation 
 * @returns {{message:string, value: number}}
 */
const calculateCustomDiceRollResult = (diceRollArray, customResultCalculation) => {

    //valid functions
    //MIN min value of all passed values e.g. MIN(D, D)
    //MAX min value of all passed values e.g. MAX(D, D)

    let total = 0;
    let returnString = '';

    let customStringCalc = (' ' + customResultCalculation).slice(1);

    // replace @D with dice values    
    const regexDice = /@D/;
    for (let i = 0; i < diceRollArray.length; i++) {
        customStringCalc = customStringCalc.replace(regexDice, diceRollArray[i]);
    }

    returnString += `[${customStringCalc}]`;

    customStringCalc = _replaceMAX(customStringCalc);
    customStringCalc = _replaceMIN(customStringCalc);

    let currentStr = '';
    let currentOperation = '';
    // calculate total
    for (let i = 0; i < customStringCalc.length; i++) {
        const currentChar = customStringCalc[i];

        // if the next char is 0-9
        if (currentChar.match(/[0-9]/) !== null) {
            currentStr += customStringCalc[i];
        }

        // if whitespace continue
        else if (currentChar === ' ') continue;

        else if (['+', '-', '/', '*'].includes(currentChar)) {
            total = _executeOperation(total, currentOperation, currentStr);
            currentStr = '';
            currentOperation = currentChar;
        }
    }
    // does last operation if needed
    if (currentStr !== '') {
        total = _executeOperation(total, currentOperation, currentStr);
    }

    returnString += ` Total: ${total}`;
    return { message:returnString, value:total };
}

/**
 * @description
 * executes operation basic arithmetic operation
 * 
 * @param {number} total current total
 * @param {string} currentOperation should be '+', '-', '/', '*' or ''
 * @param {string} currentStr the current number to add, multiply, subtract or divide
 * @returns {number}
 */
const _executeOperation = (total, currentOperation, currentStr) => {
    if (currentOperation === '-') {
        total -= parseInt(currentStr);
        currentStr = '';
    }
    else if (currentOperation === '/') {
        total /= parseInt(currentStr);
        currentStr = '';
    }
    else if (currentOperation === '*') {
        total *= parseInt(currentStr);
        currentStr = '';
    }
    // if none is provided addition is used
    else {
        total += parseInt(currentStr);
        currentStr = '';
    }
    return total;
}

/**
 * @description
 * replaces MAX() with calculated number
 * @param {string} customStringCalc
 * @returns {string}
 */
const _replaceMAX = (customStringCalc) => {
    //replace MAX(*) with result value
    const regexMAX = /MAX\(([^)]+)\)/;

    while (customStringCalc.match(regexMAX) !== null) {

        //gets roll values from within brackets
        const numbersString = customStringCalc.match(regexMAX)[1];

        //separates roll values based on comma     
        const numbersStringArray = numbersString.split(',');

        //maps string array to int array
        const numberIntArray = numbersStringArray.map((str) => parseInt(str));
        // finds max result
        const result = Math.max(...numberIntArray);

        //replace max (*) with result
        customStringCalc = customStringCalc.replace(regexMAX, result);
    }
    return customStringCalc;
}

/**
 * @description
 * replaces MIN() with calculated number
 * @param {string} customStringCalc
 * @returns {string}
 */
const _replaceMIN = (customStringCalc) => {
    //replace MAX(*) with result value
    const regexMIN = /MIN\(([^)]+)\)/;

    while (customStringCalc.match(regexMIN) !== null) {

        //gets roll values from within brackets
        const numbersString = customStringCalc.match(regexMIN)[1];

        //separates roll values based on comma     
        const numbersStringArray = numbersString.split(',');

        //maps string array to int array
        const numberIntArray = numbersStringArray.map((str) => parseInt(str));
        // finds max result
        const result = Math.min(...numberIntArray);

        //replace max (*) with result
        customStringCalc = customStringCalc.replace(regexMIN, result);
    }
    return customStringCalc;
}


export default calculateCustomDiceRollResult;