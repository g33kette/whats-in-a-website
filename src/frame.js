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
    loadingElement = $('.loading');
    messageElement = $('.message');
    completeElement = $('.complete');

    loadingElement.show();
    messageElement.show();
    completeElement.hide();

    completeElement.on('click', '#actionContinue', function() {
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
        const resultElement = completeElement.find('.result');
        resultElement.html(result.summary);
        resultElement.addClass(result.safe?'safe':(result.safe===null?'warning':'harmful'));
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
