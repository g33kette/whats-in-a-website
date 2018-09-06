
// Action Types --------------------------------------------------------------------------------------------------------

/**
 * SET_ENABLED
 * @type {string}
 */
export const SET_ENABLED = 'setEnabled';

/**
 * SET_PROCESSING_MESSAGE
 * @type {string}
 */
export const SET_PROCESSING_MESSAGE = 'setProcessingMessage';

/**
 * SET_PROCESSING_LOADING
 * @type {string}
 */
export const SET_PROCESSING_LOADING = 'setProcessingLoading';

/**
 * RESET_PROCESSING
 * @type {string}
 */
export const RESET_PROCESSING = 'resetProcessing';

/**
 * SET_REMOVE_FRAME
 * @type {string}
 */
export const SET_REMOVE_FRAME = 'setRemoveFrame';

/**
 * SET_ACTIVE_TAB_ID
 * @type {string}
 */
export const SET_ACTIVE_TAB_ID = 'setActiveTabId';

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
 * Set Processing Message
 *
 * @param {string} message
 * @param {string|undefined} [source]
 * @return {{type: string, message: *}}
 */
export function setProcessingMessage(message, source) {
    return {type: SET_PROCESSING_MESSAGE, message, source};
}

/**
 * Set Processing Loading
 *
 * @param {bool} loading
 * @param {string|undefined} [source]
 * @return {{type: string, loading: *}}
 */
export function setProcessingLoading(loading, source) {
    return {type: SET_PROCESSING_LOADING, loading, source};
}

/**
 * Reset Processing
 *
 * @param {string|undefined} [source]
 * @return {{type: string}}
 */
export function resetProcessing(source) {
    return {type: RESET_PROCESSING, source};
}

/**
 * Set Remove Frame
 *
 * @param {boolean} remove
 * @param {string|undefined} [source]
 * @return {{type: string}}
 */
export function setRemoveFrame(remove, source) {
    return {type: SET_REMOVE_FRAME, remove, source};
}

/**
 * Set Active Tab ID
 *
 * @param {int} id
 * @param {string|undefined} [source]
 * @return {{type: string}}
 */
export function setActiveTabId(id, source) {
    return {type: SET_ACTIVE_TAB_ID, id, source};
}
