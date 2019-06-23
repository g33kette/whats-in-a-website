/**
 * Accessors.js
 *
 * This script an accessor layer between the background scripts and the store.
 */

import store from './../store/store';
import {
    setCorpus,
    setTabContent,
    setClassifier,
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
 * Get: Classifier
 *
 * @return {string}
 */
export async function getClassifier() {
    return (await store.getState()).classifier;
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
 * Set: Classifier
 *
 * @param {object} classifier
 */
export function saveClassifier(classifier) {
    store.dispatch(setClassifier(classifier));
    // Get the full dataset, useful for saving state.
    // classifier.getClassifierDataset(): {[label: string]: Tensor2D}
    // Set the full dataset, useful for restoring state.
    // classifier.setClassifierDataset(dataset: {[label: string]: Tensor2D})
    // TODO persistToLocalStorage(getUsername(), 'classifier', classifier);
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
 *
 * @return {boolean}
 */
export async function triggerToggleEnabled() {
    const enabled = !(await getEnabled());
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
        enabled: await retrieveFromLocalStorage(username, 'enabled', false),
        corpus: await retrieveFromLocalStorage(username, 'corpus', {vectorSpace: [], numDocs: 0}),
        // TODO classifier: await retrieveFromLocalStorage(username, 'classifier', null),
    };
}
