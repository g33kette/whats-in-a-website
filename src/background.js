/**
 * Background.js
 *
 * This script is run constantly in the background when the extension is enabled.
 * It listens for events and manages overall state.
 */

import store from './store/store';
import {
    setEncryptionToken,
    setEnabled,
    setUsername,
    overrideStateParams,
} from './store/actions';
import {authenticate} from './services/authentication';
import {analyseContent, prepareText} from './services/analyseContent';

/**
 * Custom Event Listeners
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    /**
     * Trigger Events
     */
    switch (request.trigger) {
        case 'authenticate':
            (async () => {
                sendResponse(await triggerAuthenticate(request.params));
            })();
            return true; // Keeps async open
        case 'toggleEnabled':
            sendResponse(triggerToggleEnabled());
            return;
        case 'prepareProcessing':
            triggerPrepareProcessing(sender.tab.id);
            sendResponse(sender.tab.id);
            return;
        case 'initialiseProcessing':
            triggerInitialiseProcessing(sender.tab.id, request.content);
            sendResponse(sender.tab.id);
            return;
        default:
        // Do nothing
    }
    /**
     * Get Events
     */
    switch (request.get) {
        case 'authenticated':
            sendResponse(!!(getUsername())); // boolean response
            return;
        case 'username':
            sendResponse(getUsername());
            return;
        case 'enabled':
            sendResponse(getEnabled());
            return;
        default:
        // Do nothing
    }
});

/**
 * Tab Closed Event Listener
 */
chrome.tabs.onRemoved.addListener((tabId) => {
    // todo remove from processing
});

// Trigger Methods -----------------------------------------------------------------------------------------------------

/**
 * Trigger: Authenticate
 *
 * @param {object} params
 * @return {Promise<boolean>}
 */
async function triggerAuthenticate(params) {
    const authenticated = await authenticate(params.username, params.password);
    if (!authenticated || authenticated === null || typeof authenticated.token === 'undefined') {
        store.dispatch(setEncryptionToken(null));
        store.dispatch(setUsername(null));
        return false;
    } else {
        store.dispatch(setEncryptionToken(authenticated.token));
        store.dispatch(setUsername(params.username));
        store.dispatch(overrideStateParams(await loadStateParamsFromLocalStorage(params.username)));
        return true;
    }
}

/**
 * Trigger: Toggle Enabled
 *
 * @return {boolean}
 */
function triggerToggleEnabled() {
    const enabled = !(getEnabled());
    store.dispatch(setEnabled(enabled));
    persistToLocalStorage(getUsername(), 'enabled', enabled);
    return enabled;
}

/**
 * Trigger: Initialise Processing
 *
 * @param {int} tabId
 * @param {string} content
 */
function triggerPrepareProcessing(tabId) {
    chrome.tabs.sendMessage(tabId, {trigger: 'showMessage', message: '[1] Reading page...'});
}

/**
 * Trigger: Initialise Processing
 *
 * @param {int} tabId
 * @param {string} content
 */
function triggerInitialiseProcessing(tabId, content) {
    chrome.tabs.sendMessage(tabId, {trigger: 'showMessage', message: '[2] Processing page...'});
    prepareText(content).then((textData) => {
        chrome.tabs.sendMessage(tabId, {trigger: 'showMessage', message: '[3] Analysing content...'});
        analyseContent(textData).then((result) => {
            if (result.safe) {
                chrome.tabs.sendMessage(tabId, {trigger: 'closeFrame'});
            } else {
                chrome.tabs.sendMessage(
                    tabId,
                    {trigger: 'showMessage', message: 'Analysis Complete. Please review before continuing.'}
                );
                chrome.tabs.sendMessage(tabId, {trigger: 'showAnalysis', result: result});
            }
        });
    });
}

// Get Methods ---------------------------------------------------------------------------------------------------------

/**
 * Get: Enabled
 *
 * @return {boolean}
 */
function getEnabled() {
    return store.getState().enabled;
}

/**
 * Get: Username
 *
 * @return {string}
 */
function getUsername() {
    return store.getState().username;
}

// Local Methods -------------------------------------------------------------------------------------------------------

/**
 * Persist To Local Storage
 *
 * @param {string} username
 * @param {string} key
 * @param {*} value
 */
function persistToLocalStorage(username, key, value) {
    let assignValue = {};
    assignValue[username+'.'+key] = value;
    chrome.storage.local.set(assignValue);
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
    return new Promise((resolve) => {
        let storageKey = username+'.'+key;
        chrome.storage.local.get([storageKey], (results) => {
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
async function loadStateParamsFromLocalStorage(username) {
    return {
        enabled: await retrieveFromLocalStorage(username, 'enabled', false),
    };
}
