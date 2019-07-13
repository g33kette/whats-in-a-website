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
    SET_CLASSIFIER_DATA, CLEAR_MODEL_DATA, QUEUE_PROCESS, SET_QUEUE,
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
        queue: [],
        // TODO The plugin needs to be auto-logged in for testing - remember to re-build after changing these values
        // username: null,
        // enabled: false,
        username: 'na',
        enabled: true,
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
 * Browser Protect State
 *
 * @param {object} state
 * @param {object} action
 * @return {*}
 */
export function coreReducer(state = getInitialStateValues(), action) {
    let updatedState;
    // console.log('coreReducer', action, state);
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
            updatedState = Object.assign({}, state.tabs, {[action.tabId]: action.content});
            return Object.assign({}, state, {tabs: updatedState});
        case CLEAR_MODEL_DATA:
            return Object.assign({}, state, getInitialModelStateValues());
        case QUEUE_PROCESS:
            updatedState = state.queue;
            // Add new process to queue
            updatedState.push(action.process);
            // Re-order queue by priority
            updatedState = updatedState.sort((a, b) => {
                return (b.priority?b.priority:-1) - (a.priority?a.priority:-1);
            });
            return Object.assign({}, state, {queue: updatedState});
        case SET_QUEUE:
            return Object.assign({}, state, {queue: action.queue});
        default:
            return state;
    }
}
