import {
    OVERRIDE_STATE_PARAMS,
    SET_ENCRYPTION_TOKEN,
    SET_USERNAME,
    SET_ENABLED,
} from './actions';

/**
 * Get Initial State
 *
 * @return {*}
 */
export async function getInitialState() {
    return {
        encryptionToken: null,
        username: null,
        enabled: false,
        tabs: [],
    };
}

/**
 * Browser Protect State
 *
 * @param {object} state
 * @param {object} action
 * @return {*}
 */
export function coreReducer(state = getInitialState(), action) {
    switch (action.type) {
        case OVERRIDE_STATE_PARAMS:
            return Object.assign({}, state, action.params);
        case SET_ENCRYPTION_TOKEN:
            return Object.assign({}, state, {encryptionToken: action.encryptionToken});
        case SET_USERNAME:
            return Object.assign({}, state, {username: action.username});
        case SET_ENABLED:
            return Object.assign({}, state, {enabled: action.enabled});
        default:
            return state;
    }
}
