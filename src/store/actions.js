
// Actions -------------------------------------------------------------------------------------------------------------

export const RESET = 'reset';
export const reset = (source) => ({type: RESET, source});

export const OVERRIDE_STATE_PARAMS = 'overrideStateParams';
export const overrideStateParams = (params, source) => ({type: OVERRIDE_STATE_PARAMS, params, source});

export const SET_ENCRYPTION_TOKEN = 'setEncryptionToken';
export const setEncryptionToken = (encryptionToken, source) => ({type: SET_ENCRYPTION_TOKEN, encryptionToken, source});

export const SET_USERNAME = 'setUsername';
export const setUsername = (username, source) => ({type: SET_USERNAME, username, source});

export const SET_ENABLED = 'setEnabled';
export const setEnabled = (enabled, source) => ({type: SET_ENABLED, enabled, source});

export const SET_CORPUS = 'setCorpus';
export const setCorpus = (corpus, source) => ({type: SET_CORPUS, corpus, source});

export const SET_CLASSIFIER = 'setClassifier';
export const setClassifier = (classifier, source) => ({type: SET_CLASSIFIER, classifier, source});

export const SET_TAB_CONTENT = 'setTabContent';
export const setTabContent = (tabId, content, source) => ({type: SET_TAB_CONTENT, tabId, content, source});
