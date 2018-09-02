import {
    SET_MESSAGE,
    SET_ENABLED,
    SET_LOADING,
} from './actions';

/**
 * Get Initial State
 *
 * @return {*}
 */
export function getInitialState() {
    return {
        message: '',
        enabled: false,
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
        case SET_MESSAGE:
            return Object.assign({}, state, {
                message: action.message,
            });
        case SET_ENABLED:
            return Object.assign({}, state, {
                enabled: action.enabled,
            });
        case SET_LOADING:
            return Object.assign({}, state, {
                loading: action.loading,
            });
        default:
            return state;
    }
}
