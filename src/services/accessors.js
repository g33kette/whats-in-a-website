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
} from './../store/actions';

let extensionLocalStorage;
configureLocalStorageApi();

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
 */
export async function saveClassifier(classifier) {
    store.dispatch(setClassifier(classifier));
    // Also save data set and persist to storage
    const classifierDataSet = classifier.getClassifierDataset();
    const classifierData = {
        safe: classifierDataSet.safe?Array.from(classifierDataSet.safe.dataSync()):[],
        harmful: classifierDataSet.harmful?Array.from(classifierDataSet.harmful.dataSync()):[],
    };
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
 * Persist To Local Storage
 *
 * @param {string} username
 * @param {string} key
 * @param {*} value
 */
export function persistToLocalStorage(username, key, value) {
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
export async function retrieveFromLocalStorage(username, key, defaultValue = null) {
    return new Promise((resolve) => {
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
        classifierData: await retrieveFromLocalStorage(username, 'classifierData', null),
    };
}
