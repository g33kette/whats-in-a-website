
import store from './store/store';
import {
    setEncryptionToken,
    setEnabled,
    setUsername,
    overrideStateParams,
} from './store/actions';
import {authenticate} from './services/authentication';

/**
 * Custom Event Listeners
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('listening', request);
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
        case 'initialiseProcessing':
            chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
                triggerInitialiseProcessing(tabs[0].id, request.content);
            });
            sendResponse(true);
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
function triggerInitialiseProcessing(tabId, content) {
    // todo store.dispatch(initialiseProcessing(tabId, content));
    // todo https://stackoverflow.com/questions/14245334/chrome-extension-sendmessage-from-background-to-content-script-doesnt-work
    // todo chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {})
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

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// chrome.webNavigation.onCommitted.addListener(function(details) {
//         // https://developer.chrome.com/extensions/content_scripts
//
//         // // console.log(JSON.stringify(details));
//         // let headers = details.requestHeaders;
//         // let blockingResponse = {};
//         //
//         // // Each header parameter is stored in an array. Since Chrome
//         // // makes no guarantee about the contents/order of this array,
//         // // you'll have to iterate through it to find for the
//         // // 'User-Agent' element
//         // for (let i = 0, l = headers.length; i < l; ++i ) {
//         //     if (headers[i].name === 'User-Agent') {
//         //         headers[i].value = '>>> Your new user agent string here <<<';
//         //         console.log(headers[i].value);
//         //         break;
//         //     }
//         //     // If you want to modify other headers, this is the place to
//         //     // do it. Either remove the 'break;' statement and add in more
//         //     // conditionals or use a 'switch' statement on 'headers[i].name'
//         // }
//         //
//         // blockingResponse.requestHeaders = headers;
//         // return blockingResponse;
//         // chrome.webNavigation.getAllFrames(object details, function callback)
//         // todo console.log('details', details.url);
//         // todo chrome.webNavigation.getFrame({tabId: details.tabId, frameId: details.frameId}, (frame) => {
//         // todo     console.log('frame', frame);
//         // todo });
//         // console.log('content', details);
//         // alert('details', details);
//         // alert('url', details.url);
//         return {cancel: true};
//         // return {cancel: details.url.indexOf('://*.bbc.co.uk/*') !== -1};
//     },
//     {urls: ['*://*.bbc.co.uk/*']},
//     ['requestHeaders', 'blocking']
// );
// chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
//         // // console.log(JSON.stringify(details));
//         // let headers = details.requestHeaders;
//         // let blockingResponse = {};
//         //
//         // // Each header parameter is stored in an array. Since Chrome
//         // // makes no guarantee about the contents/order of this array,
//         // // you'll have to iterate through it to find for the
//         // // 'User-Agent' element
//         // for (let i = 0, l = headers.length; i < l; ++i ) {
//         //     if (headers[i].name === 'User-Agent') {
//         //         headers[i].value = '>>> Your new user agent string here <<<';
//         //         console.log(headers[i].value);
//         //         break;
//         //     }
//         //     // If you want to modify other headers, this is the place to
//         //     // do it. Either remove the 'break;' statement and add in more
//         //     // conditionals or use a 'switch' statement on 'headers[i].name'
//         // }
//         //
//         // blockingResponse.requestHeaders = headers;
//         // return blockingResponse;
//         console.log('url', details.url);
//         alert('url', details.url);
//         return {cancel: details.url.indexOf('://*.bbc.co.uk/*') !== -1};
//     },
//     {urls: ['<all_urls>']},
//     ['requestHeaders', 'blocking']
// );

// import $ from 'jquery';

// console.log('Hello from your Chrome extension!');
//
// chrome.webRequest.onBeforeRequest.addListener(() => {
//         console.log('beforeRequest Listener');
//     },
//     {urls: ['*://www.bbc.co.uk/*']},
//     ['blocking']
//     // , filter, opt_extraInfoSpec
// );


// let html = document.getElementsByTagName('html');
// html[0].innerHTML = 'Testing 1 2 3.';

// $(document).ready(function() {
//     let style = [
//         'width: 100%;',
//         'height: 100%;',
//         'z-index:1000;',
//         'background-color: rgba(0, 255, 0, 0.6);',
//         'position: absolute;',
//     ];
//     let cover = $('<div style="'+style.join(' ')+'"><h1 style="text-align: center">WARNING</h1></div>');
//     // console.log('cover', cover);
//     let content = $('<pre ' +
//  'style="width: 80%; height: 60vh; overflow: auto; margin: auto; background-color: rgba(255, 255, 0, 0.6);" />');
//     content.text($('body').text());
//     cover.append(content);
//     // console.log('content', content);
//     $('html').prepend(cover);// .css('height', '100%');
//     $('body').hide();
// });


// "background_ignore": [
//     {
//         "todo I think this should be replace the content load bit below":"",
//         "matches": ["<all_urls>"],
//         "js": ["background.js"]
//     }
// ],
//     "content_scripts_ignore": [
//     {
//         "matches": [
//             "<all_urls>"
//         ],
//         "js": ["background.js"]
//     }
// ],
