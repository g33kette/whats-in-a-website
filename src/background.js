/**
 * Background.js
 *
 * This script is run constantly in the background when the extension is enabled.
 * It listens for events and manages overall state.
 */

import store from './store/store';
import {
    setEncryptionToken,
    setUsername,
    overrideStateParams,
} from './store/actions';
import {authenticate} from './services/authentication';
import {analyseContent, prepareText} from './services/analyseContent';
import {trainModel} from './services/model';
import {
    getEnabled,
    getTabContent,
    getUsername,
    saveTabContent,
    loadStateParamsFromLocalStorage,
    triggerToggleEnabled,
} from './services/accessors';
import {summariseText} from './services/summarise';

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
            (async () => {
                sendResponse(await triggerToggleEnabled());
            })();
            return;
        case 'prepareProcessing':
            triggerPrepareProcessing(sender.tab.id);
            sendResponse(sender.tab.id);
            return;
        case 'initialiseProcessing':
            triggerInitialiseProcessing(sender.tab.id, request.content);
            sendResponse(sender.tab.id);
            return;
        case 'markContentSafe':
            // The following calls promise but does not need to wait for resolution
            triggerMarkContentSafe(sender.tab.id);
            sendResponse(sender.tab.id);
            return;
        case 'markContentHarmful':
            // The following calls promise but does not need to wait for resolution
            triggerMarkContentHarmful(sender.tab.id);
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
            (async () => {
                sendResponse(!!(await getUsername())); // boolean response
            })();
            return;
        case 'username':
            (async () => {
                sendResponse(await getUsername());
            })();
            return;
        case 'enabled':
            (async () => {
                sendResponse(await getEnabled());
            })();
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
        await triggerToggleEnabled(true);
        return true;
    }
}

/**
 * Trigger: Initialise Processing
 *
 * @param {int} tabId
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
    prepareText(content).then((textVector) => {
        chrome.tabs.sendMessage(tabId, {trigger: 'showMessage', message: '[3] Analysing content...'});
        saveTabContent(tabId, textVector);
        analyseContent(textVector).then((result) => {
            chrome.tabs.sendMessage(tabId, {trigger: 'showMessage', message: '[4] Summarising content...'});
            summariseText(content).then((summary) => {
                chrome.tabs.sendMessage(
                    tabId,
                    {trigger: 'showMessage', message: 'Analysis Complete. Please review before continuing.'}
                );
                chrome.tabs.sendMessage(tabId, {trigger: 'showAnalysis', result: result, summary: summary});
            });
        });
    });
}

/**
 * Trigger: Mark Content Safe
 *
 * @param {int} tabId
 */
async function triggerMarkContentSafe(tabId) {
    // The following calls promise but does not need to wait for resolution
    trainModel(await getTabContent(tabId), 'safe');
}

/**
 * Trigger: Mark Content Harmful
 *
 * @param {int} tabId
 */
async function triggerMarkContentHarmful(tabId) {
    // The following calls promise but does not need to wait for resolution
    trainModel(await getTabContent(tabId), 'harmful');
}
