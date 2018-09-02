
// Action Types --------------------------------------------------------------------------------------------------------

/**
 * SET_MESSAGE
 * @type {string}
 */
export const SET_MESSAGE = 'setMessage';

/**
 * SET_ENABLED
 * @type {string}
 */
export const SET_ENABLED = 'setEnabled';

/**
 * SET_LOADING
 * @type {string}
 */
export const SET_LOADING = 'setLoading';

// Action Creators -----------------------------------------------------------------------------------------------------

/**
 * Set Message
 *
 * @param {string} message
 * @return {{type: string, message: *}}
 */
export function setMessage(message) {
    return {type: SET_MESSAGE, message};
}

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
 * Set Loading
 *
 * @param {bool} loading
 * @return {{type: string, loading: *}}
 */
export function setLoading(loading) {
    return {type: SET_LOADING, loading};
}
