
// Action Types --------------------------------------------------------------------------------------------------------

/**
 * SET_ENABLED
 * @type {string}
 */
export const SET_ENABLED = 'setEnabled';

/**
 * SET_SCAN_MESSAGE
 * @type {string}
 */
export const SET_SCAN_MESSAGE = 'setScanMessage';

/**
 * SET_SCAN_LOADING
 * @type {string}
 */
export const SET_SCAN_LOADING = 'setScanLoading';

/**
 * RESET_SCAN
 * @type {string}
 */
export const RESET_SCAN = 'resetScan';

// Action Creators -----------------------------------------------------------------------------------------------------

/**
 * Set Enabled
 *
 * @param {bool} enabled
 * @param {string|undefined} [source]
 * @return {{type: string, enabled: *}}
 */
export function setEnabled(enabled, source) {
    return {type: SET_ENABLED, enabled, source};
}

/**
 * Set Scan Message
 *
 * @param {string} message
 * @param {string|undefined} [source]
 * @return {{type: string, message: *}}
 */
export function setScanMessage(message, source) {
    return {type: SET_SCAN_MESSAGE, message, source};
}

/**
 * Set Scan Loading
 *
 * @param {bool} loading
 * @param {string|undefined} [source]
 * @return {{type: string, loading: *}}
 */
export function setScanLoading(loading, source) {
    return {type: SET_SCAN_LOADING, loading, source};
}

/**
 * Reset Scan
 *
 * @param {string|undefined} [source]
 * @return {{type: string}}
 */
export function resetScan(source) {
    return {type: RESET_SCAN, source};
}
