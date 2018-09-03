import {
    SET_ENABLED,
    SET_SESSION_MESSAGE,
    SET_SESSION_LOADING,
    CLEAR_SESSION,
} from './actions';

/**
 * Get Empty Session
 *
 * @return {*}
 */
export function getInitialState() {
    return {
        enabled: false,
        session: getEmptySession(),
    };
}

/**
 * Get Empty Session
 *
 * @return {*}
 */
export function getEmptySession() {
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
            return persistToStateAndStorage('enabled', action.enabled, state);
        case SET_SESSION_MESSAGE:
            return persistToStateAndStorage(
                'session',
                Object.assign({}, state.session, {message: action.message}),
                state
            );
        case SET_SESSION_LOADING:
            return persistToStateAndStorage(
                'session',
                Object.assign({}, state.session, {loading: action.loading}),
                state
            );
        case CLEAR_SESSION:
            return persistToStateAndStorage('session', getEmptySession(), state);
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
 * @return {object}
 */
function persistToStateAndStorage(key, value, state) {
    console.log('persistToStateAndStorage', key, value);
    let assignValue = {};
    assignValue[key] = value;
    chrome.storage.sync.set(assignValue, () => {
        console.log('saved to storage', assignValue);
    });
    return Object.assign({}, state, assignValue);
}
