
// Actions -------------------------------------------------------------------------------------------------------------

export const RESET = 'reset';
export const reset = () => ({type: RESET});

export const OVERRIDE_STATE_PARAMS = 'overrideStateParams';
export const overrideStateParams = (params) => ({type: OVERRIDE_STATE_PARAMS, params});

export const SET_ENCRYPTION_TOKEN = 'setEncryptionToken';
export const setEncryptionToken = (encryptionToken) => ({type: SET_ENCRYPTION_TOKEN, encryptionToken});

export const SET_USERNAME = 'setUsername';
export const setUsername = (username) => ({type: SET_USERNAME, username});

export const SET_ENABLED = 'setEnabled';
export const setEnabled = (enabled) => ({type: SET_ENABLED, enabled});

export const SET_CORPUS = 'setCorpus';
export const setCorpus = (corpus) => ({type: SET_CORPUS, corpus});

export const SET_PHRASE_CORPUS = 'setPhraseCorpus';
export const setPhraseCorpus = (phraseCorpus) => ({type: SET_PHRASE_CORPUS, phraseCorpus});

export const SET_CLASSIFIER = 'setClassifier';
export const setClassifier = (classifier) => ({type: SET_CLASSIFIER, classifier});

export const SET_CLASSIFIER_DATA = 'setClassifierData';
export const setClassifierData = (classifierData)=> ({type: SET_CLASSIFIER_DATA, classifierData});

export const SET_TAB_CONTENT = 'setTabContent';
export const setTabContent = (tabId, content) => ({type: SET_TAB_CONTENT, tabId, content});

export const CLEAR_MODEL_DATA = 'clearModelData';
export const clearModelData = () => ({type: CLEAR_MODEL_DATA});

export const QUEUE_PROCESS = 'queueProcess';
export const queueProcess = (process) => ({type: QUEUE_PROCESS, process});

export const SET_QUEUE = 'setQueue';
export const setQueue = (queue) => ({type: SET_QUEUE, queue});
