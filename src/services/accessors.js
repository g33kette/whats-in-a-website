/**
 * Accessors.js
 *
 * This script an accessor layer between the background scripts and the store.
 */

import store from './../store/store';
import {
    setCorpus,
    setPhraseCorpus,
    setTabContent,
    setClassifier,
    setClassifierData,
    setEnabled,
    setQueue,
    clearModelData,
    queueProcess,
    reset, setUsername, overrideStateParams,
} from './../store/actions';
import {ProcessQueue} from './processQueue';

let extensionLocalStorage;
configureLocalStorageApi();

let processQueue = new ProcessQueue();

/**
 * Configure Local Storage API - Can be manipulated when testing.
 * @param {*} [localStorage]
 */
export function configureLocalStorageApi(localStorage) {
    if (typeof localStorage !== 'undefined') {
        extensionLocalStorage = localStorage;
    } else if (typeof chrome !== 'undefined') {
        extensionLocalStorage = chrome.storage.local;
    } else {
        extensionLocalStorage = {
            get(k, cb) {
                cb({});
            },
            set() {},
        };
    }
}

// Get Methods ---------------------------------------------------------------------------------------------------------

/**
 * Get: Enabled
 *
 * @return {boolean}
 */
export async function getEnabled() {
    return (await store.getState()).enabled;
}

/**
 * Get: Username
 *
 * @return {string}
 */
export async function getUsername() {
    return (await store.getState()).username;
}

/**
 * Get: Corpus
 *
 * @return {string}
 */
export async function getCorpus() {
    return (await store.getState()).corpus;
}

/**
 * Get: Phrase Corpus
 *
 * @return {string}
 */
export async function getPhraseCorpus() {
    return (await store.getState()).phraseCorpus;
}

/**
 * Get: Classifier
 *
 * @return {string}
 */
export async function getClassifier() {
    return (await store.getState()).classifier;
}

/**
 * Get: Classifier Data
 *
 * @return {string}
 */
export async function getClassifierData() {
    return (await store.getState()).classifierData;
}

/**
 * Get: Tab Content
 *
 * @param {int|string} tabId
 * @return {*}
 */
export async function getTabContent(tabId) {
    return (await store.getState()).tabs[tabId];
}

// Set Methods ---------------------------------------------------------------------------------------------------------

/**
 * Set: Corpus
 *
 * @param {object} corpus
 */
export async function saveCorpus(corpus) {
    store.dispatch(setCorpus(corpus));
    persistToLocalStorage(await getUsername(), 'corpus', corpus);
}

/**
 * Set: Phrase Corpus
 *
 * @param {object} phraseCorpus
 */
export async function savePhraseCorpus(phraseCorpus) {
    store.dispatch(setPhraseCorpus(phraseCorpus));
    persistToLocalStorage(await getUsername(), 'phraseCorpus', phraseCorpus);
}

/**
 * Set: Classifier
 *
 * @param {object} classifier
 * @param {object} classifierData
 */
export async function saveClassifier(classifier, classifierData) {
    store.dispatch(setClassifier(classifier));
    // Also save data set and persist to storage
    store.dispatch(setClassifierData(classifierData));
    persistToLocalStorage(await getUsername(), 'classifierData', classifierData);
}

/**
 * Set: Tab Content
 *
 * @param {int|string} tabId
 * @param {*} content
 */
export function saveTabContent(tabId, content) {
    store.dispatch(setTabContent(tabId, content));
}

/**
 * Clear: Model Data
 */
export async function clearAllData() {
    store.dispatch(clearModelData());
    persistToLocalStorage(await getUsername(), 'corpus', await getCorpus());
    persistToLocalStorage(await getUsername(), 'phraseCorpus', await getPhraseCorpus());
    persistToLocalStorage(await getUsername(), 'classifierData', await getClassifierData());
}

// General Methods -----------------------------------------------------------------------------------------------------

/**
 * Trigger: Toggle Enabled
 * @param {boolean|undefined} [forceState]
 * @return {boolean}
 */
export async function triggerToggleEnabled(forceState) {
    const enabled = typeof forceState === 'undefined'?!(await getEnabled()):forceState;
    store.dispatch(setEnabled(enabled));
    persistToLocalStorage(await getUsername(), 'enabled', enabled);
    return enabled;
}

/**
 * Set Authenticated User
 *
 * @param {string} username
 * @param {string} token
 */
export async function setAuthenticatedUser(username, token) {
    store.dispatch(setUsername(username));
    return true;
}

/**
 * Override State Params For Username
 *
 * @param {string} username
 */
export async function overrideStateParamsForUsername(username) {
    store.dispatch(overrideStateParams(await loadStateParamsFromLocalStorage(username)));
    return true;
}

/**
 * Reset State
 */
export async function resetState() {
    store.dispatch(reset());
    return true;
}

/**
 * Queue and Run Process
 *
 * @param {*} process
 */
export function queueAndRunProcess(process) {
    store.dispatch(queueProcess(process));
    processQueue.process();
}

/**
 * Next Queued Process
 *
 * @return {*}
 */
export async function nextQueuedProcess() {
    const queue = (await store.getState()).queue;
    if (queue.length) {
        const nextProcess = queue.shift();
        store.dispatch(setQueue(queue));
        return nextProcess;
    }
    // Else
    return null;
}

/**
 * Persist To Local Storage
 *
 * @param {string} username
 * @param {string} key
 * @param {*} value
 */
function persistToLocalStorage(username, key, value) {
    if (!username) {
        throw new Error('User is not logged in, cannot save data.');
    }
    let assignValue = {};
    assignValue[username+'.'+key] = value;
    extensionLocalStorage.set(assignValue);
}

/**
 * Retrieve From Local Storage
 *
 * @param {string} username
 * @param {string} key
 * @param {*} defaultValue
 * @return {Promise<void>}
 */
async function retrieveFromLocalStorage(username, key, defaultValue = null) {
    return new Promise((resolve, reject) => {
        if (!username) {
            reject(new Error('User is not logged in, cannot retrieve data.'));
        }
        let storageKey = username+'.'+key;
        extensionLocalStorage.get([storageKey], (results) => {
            resolve(typeof results[storageKey] !== 'undefined'?results[storageKey]:defaultValue);
        });
    });
}

/**
 * Load State Params From Local Storage
 *
 * @param {string} username
 * @return {*}
 */
export async function loadStateParamsFromLocalStorage(username) {
    return {
        corpus: await retrieveFromLocalStorage(username, 'corpus', {vectorSpace: [], numDocs: 0}),
        phraseCorpus: await retrieveFromLocalStorage(
            username,
            'phraseCorpus',
            {vectorSpace: [], numDocs: 0}
        ),
        classifierData: await retrieveFromLocalStorage(username, 'classifierData', null),
    };
}
