import {
    OVERRIDE_STATE_PARAMS,
    SET_ENCRYPTION_TOKEN,
    SET_USERNAME,
    SET_ENABLED,
    SET_CORPUS,
    SET_TAB_CONTENT,
    SET_CLASSIFIER,
} from './actions';

/**
 * Get Initial State
 *
 * @return {*}
 */
export async function getInitialState() {
    return {
        encryptionToken: null,
        // TODO The plugin needs to be auto-enabled for testing
        // username: null,
        // enabled: false,
        username: 'null',
        enabled: true,
        // TODO ----
        tabs: {},
        corpus: {vectorSpace: [], numDocs: 0},
        classifier: null,
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
    let tabs;
    switch (action.type) {
        case OVERRIDE_STATE_PARAMS:
            return Object.assign({}, state, action.params);
        case SET_ENCRYPTION_TOKEN:
            return Object.assign({}, state, {encryptionToken: action.encryptionToken});
        case SET_USERNAME:
            return Object.assign({}, state, {username: action.username});
        case SET_ENABLED:
            return Object.assign({}, state, {enabled: action.enabled});
        case SET_CORPUS:
            return Object.assign({}, state, {corpus: action.corpus});
        case SET_CLASSIFIER:
            return Object.assign({}, state, {classifier: action.classifier});
        case SET_TAB_CONTENT:
            tabs = Object.assign({}, state.tabs, {[action.tabId]: action.content});
            return Object.assign({}, state, {tabs: tabs});
        default:
            return state;
    }
}
