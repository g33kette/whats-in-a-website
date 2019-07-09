import {
    RESET,
    OVERRIDE_STATE_PARAMS,
    SET_ENCRYPTION_TOKEN,
    SET_USERNAME,
    SET_ENABLED,
    SET_CORPUS,
    SET_PHRASE_CORPUS,
    SET_TAB_CONTENT,
    SET_CLASSIFIER,
    SET_CLASSIFIER_DATA, CLEAR_MODEL_DATA,
} from './actions';

/**
 * Get Initial State Values
 *
 * @return {*}
 */
function getInitialStateValues() {
    return Object.assign({}, getInitialModelStateValues(), {
        encryptionToken: null,
        tabs: {},
        // TODO The plugin needs to be auto-logged in for testing - remember to re-build after changing these values
        username: null,
        enabled: false,
        // username: 'na',
        // enabled: true,
        // /TODO ----
    });
}

/**
 * Get Initial Model State Values
 *
 * @return {object}
 */
function getInitialModelStateValues() {
    return {
        corpus: {vectorSpace: [], numDocs: 0},
        phraseCorpus: {vectorSpace: [], numDocs: 0},
        classifier: null,
        classifierData: null,
    };
}

/**
 * Get Initial State - Wraps getInitialStateValues in a promise.
 *
 * @return {*}
 */
export async function getInitialState() {
    return getInitialStateValues();
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
        case RESET:
            return Object.assign({}, getInitialStateValues());
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
        case SET_PHRASE_CORPUS:
            return Object.assign({}, state, {phraseCorpus: action.phraseCorpus});
        case SET_CLASSIFIER:
            return Object.assign({}, state, {classifier: action.classifier});
        case SET_CLASSIFIER_DATA:
            return Object.assign({}, state, {classifierData: action.classifierData});
        case SET_TAB_CONTENT:
            tabs = Object.assign({}, state.tabs, {[action.tabId]: action.content});
            return Object.assign({}, state, {tabs: tabs});
        case CLEAR_MODEL_DATA:
            return Object.assign({}, state, getInitialModelStateValues());
        default:
            return state;
    }
}
