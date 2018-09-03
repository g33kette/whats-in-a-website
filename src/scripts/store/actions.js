
// Action Types --------------------------------------------------------------------------------------------------------

/**
 * SET_ENABLED
 * @type {string}
 */
export const SET_ENABLED = 'setEnabled';

/**
 * SET_MESSAGE
 * @type {string}
 */
export const SET_SESSION_MESSAGE = 'setSessionMessage';

/**
 * SET_LOADING
 * @type {string}
 */
export const SET_SESSION_LOADING = 'setSessionLoading';

/**
 * CLEAR_SESSION
 * @type {string}
 */
export const CLEAR_SESSION = 'clearSession';

// Action Creators -----------------------------------------------------------------------------------------------------

/**
 * Set Enabled
 *
 * @param {bool} enabled
 * @return {{type: string, enabled: *}}
 */
export function setEnabled(enabled) {
    return {type: SET_ENABLED, enabled};
}

/**
 * Set Session Message
 *
 * @param {string} message
 * @return {{type: string, message: *}}
 */
export function setSessionMessage(message) {
    return {type: SET_SESSION_MESSAGE, message};
}

/**
 * Set Session Loading
 *
 * @param {bool} loading
 * @return {{type: string, loading: *}}
 */
export function setSessionLoading(loading) {
    return {type: SET_SESSION_LOADING, loading};
}

/**
 * Clear Session
 *
 * @return {{type: string}}
 */
export function clearSession() {
    return {type: SET_SESSION_LOADING};
}
