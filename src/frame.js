/**
 * Frame.js
 *
 * This script is included in the iFrame overlay that is injected into the page to hide existing content.
 * Some methods that manipulate content on this frame (e.g. messages) must be run here not content.js (no permissions)
 */

import $ from 'jquery';

let loadingElement;
let messageElement;
let completeElement;

$(document).ready(function() {
    window.parent.postMessage('FRAME LOADED', '*');

    loadingElement = $('.loading');
    messageElement = $('.message');
    completeElement = $('.complete');

    loadingElement.show();
    messageElement.show();
    completeElement.hide();

    completeElement.on('click', '.action-safe', function() {
        chrome.tabs.getCurrent((tab) => {
            chrome.tabs.sendMessage(tab.id, {trigger: 'markContentSafe'});
            chrome.tabs.sendMessage(tab.id, {trigger: 'closeFrame'});
        });
    });
    completeElement.on('click', '.action-harmful', function() {
        chrome.tabs.getCurrent((tab) => {
            chrome.tabs.sendMessage(tab.id, {trigger: 'markContentHarmful'});
            completeElement.find('.classification-actions').hide();
            completeElement.find('.after-harmful-actions').show();
        });
    });
    completeElement.on('click', '.action-review', function() {
        chrome.tabs.getCurrent((tab) => {
            chrome.tabs.sendMessage(tab.id, {trigger: 'closeFrame'});
            chrome.tabs.sendMessage(tab.id, {trigger: 'showTrainingFrame'});
        });
    });

    completeElement.on('click', '#actionClose', function() {
        chrome.tabs.getCurrent((tab) => {
            chrome.tabs.remove(tab.id);
        });
    });
    completeElement.on('click', '#actionGoBack', function() {
        chrome.tabs.getCurrent(() => {
            history.back();
        });
    });
});

window.addEventListener('message', (e) => {
    // if (e.origin === 'chrome-extension://'+chrome.runtime.id) {
        console.log('FRAME RECEIVED', e);
    // }
}, false);

/**
 * Listens for events to be actioned on tab
 */
chrome.runtime.onMessage.addListener((request) => {
    // console.log('frame.js', request);
    /**
     * Trigger Events
     */
    switch (request.trigger) {
        case 'showMessage':
            console.log('FRAME', request.message);
            updateMessage(request.message);
            return;
        case 'showAnalysis':
            showAnalysis(request.result, request.summary);
            return;
        default:
        // Do Nothing
    }
});

/**
 * Update Message
 *
 * @param {string} message
 */
const updateMessage = (message) => {
    if (messageElement) {
        messageElement.html(message);
    }
};

/**
 * Show Analysis
 *
 * @param {object} result
 * @param {array} [summary]
 */
const showAnalysis = (result, summary) => {
    if (loadingElement) {
        loadingElement.hide();
    }
    if (completeElement) {
        // Display classification result
        const classificationContainerElement = completeElement.find('.classification-container');
        const resultString = result.safe?'safe':(result.safe===null?'unknown':'harmful');
        if (resultString !== 'unknown') {
            // Only show result if the classification was successful
            const resultElement = classificationContainerElement.find('#result');
            const resultClass = resultString === 'unknown'?'warning':resultString;
            resultElement.html(result.classification);
            resultElement.addClass(resultClass);
        } else {
            // If unknown, show classification required instructions
            classificationContainerElement.hide();
            completeElement.find('.classification-required').show();
        }
        // If message is returned then display message
        if (result.message) {
            const classificationMessageElement = completeElement.find('.classification-message');
            classificationMessageElement.html(result.message);
            classificationMessageElement.show();
        }
        // Display appropriate actions
        completeElement.find('.classification-actions-'+resultString).show();
        // Display content summary
        if (summary && summary.length) {
            const summaryContainerElement = completeElement.find('.summary-container');
            const summaryElement = summaryContainerElement.find('.summary');
            summaryElement.html(convertListToHtml(summary));
            summaryContainerElement.show();
        }
        // Show element
        completeElement.show();
    }
};

const convertListToHtml = (arr) => {
    let bits = [];
    for (const row of arr) {
        bits.push('<li>'+row+'</li>');
    }
    return '<ul>'+bits.join('')+'</ul>';
};
