// defines js docs types

/**
 * @typedef Settings
 * @type {object}
 * @property {boolean} shadowsEnabled set to true if the shadows are enabled
 * @property {number} fontSizeMulti multiplier applied to font size
 */


/**
 * @typedef CustomRollData
 * @type {object}
 * @property {string} name
 * @property {Array<number>} diceRollArray
 * @property {string} customResultCalculation
 * @property {boolean} hidden
 */


/**
 * @typedef PersistentData
 * @type {object}
 * @property {Settings} settings
 * @property {Array<CustomRollData>} customRollsData
 */


/**
 * @typedef FullScreenPanelData
 * @type {object}
 * @property {function} showPanel function expects string parameter with value from PANEL_TYPES
 * @property {function} closePanel closes the currently visible panel
 * @property {string} currentPanel the type of the current panel
 * @property {object} panelProps an object containing any props the panel may need
 */