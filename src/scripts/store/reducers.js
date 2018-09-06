import {
    SET_ENABLED,
    SET_PROCESSING_MESSAGE,
    SET_PROCESSING_LOADING,
    RESET_PROCESSING,
    SET_REMOVE_FRAME,
    SET_ACTIVE_TAB_ID,
} from './actions';

/**
 * Get Initial State
 *
 * @return {*}
 */
export function getInitialState() {
    return {
        enabled: false,
        activeTabId: null,
        removeFrame: false,
        processing: getNewProcessing(),
    };
}

/**
 * Get New Processing
 *
 * @return {*}
 */
export function getNewProcessing() {
    return {
        message: '',
        loading: true,
    };
}

/**
 * Browser Protect State
 *
 * @param {object} state
 * @param {string} action
 * @return {*}
 */
export function bpState(state = getInitialState(), action) {
    switch (action.type) {
        case SET_ENABLED:
            return persistToStateAndStorage('enabled', action.enabled, state, action.source);
        case SET_ACTIVE_TAB_ID:
            return persistToStateAndStorage('activeTabId', action.id, state, action.source);
        case SET_REMOVE_FRAME:
            return persistToStateAndStorage('removeFrame', action.remove, state, action.source);
        case SET_PROCESSING_MESSAGE:
            return persistToStateAndStorage(
                'processing',
                Object.assign({}, state.processing, {message: action.message}),
                state,
                action.source
            );
        case SET_PROCESSING_LOADING:
            return persistToStateAndStorage(
                'processing',
                Object.assign({}, state.processing, {loading: action.loading}),
                state,
                action.source
            );
        case RESET_PROCESSING:
            return persistToStateAndStorage('processing', getNewProcessing(), state, action.source);
        default:
            return state;
    }
}

/**
 * Persist To State And Storage
 *
 * @param {string} key
 * @param {*} value
 * @param {object} state
 * @param {string|undefined} source
 * @return {object}
 */
function persistToStateAndStorage(key, value, state, source) {
    let assignValue = {};
    assignValue[key] = value;
    if (source !== 'storage') {
        // console.log('update storage', assignValue);
        chrome.storage.sync.set(assignValue);
    }
    // console.log('update state', assignValue);
    return Object.assign({}, state, assignValue);
}
