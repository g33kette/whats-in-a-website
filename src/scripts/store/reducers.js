import {
    SET_ENABLED,
    SET_SCAN_MESSAGE,
    SET_SCAN_LOADING,
    RESET_SCAN,
} from './actions';

/**
 * Get Initial State
 *
 * @return {*}
 */
export function getInitialState() {
    return {
        enabled: false,
        scan: getNewScan(),
    };
}

/**
 * Get New Scan
 *
 * @return {*}
 */
export function getNewScan() {
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
        case SET_SCAN_MESSAGE:
            return persistToStateAndStorage(
                'scan',
                Object.assign({}, state.scan, {message: action.message}),
                state,
                action.source
            );
        case SET_SCAN_LOADING:
            return persistToStateAndStorage(
                'scan',
                Object.assign({}, state.scan, {loading: action.loading}),
                state,
                action.source
            );
        case RESET_SCAN:
            return persistToStateAndStorage('scan', getNewScan(), state, action.source);
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
