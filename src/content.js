/**
 * Content.js
 *
 * This script is injected into each tab. If the extension is enables it hides and reads the content and triggers
 * processing events.
 */

import $ from 'jquery';

/**
 * IFrame element from overlay
 *
 * @type {*|jQuery|HTMLElement}
 */
const frame = $('<iframe ' +
    'style="width: 100% !important; height: 100vh !important; top: 0 !important; right: 0 !important; ' +
    'position: fixed !important; z-index: 999999999999999999999999999999999999999999999999999999999 !important;" ' +
    'src="'+chrome.runtime.getURL('pages/protection_overlay.html')+'"></iframe>');

/**
 * On Load Event
 *
 * Checks that protection is enabled, if it is then hides content and triggers processing to start
 */
chrome.runtime.sendMessage({get: 'enabled'}, (enabled) => {
    if (enabled) {
        hideContent().then(async () => {
            chrome.runtime.sendMessage({trigger: 'prepareProcessing'});
            parseContent($('body')).then((content) => {
                chrome.runtime.sendMessage({trigger: 'initialiseProcessing', content: content});
            });
        });
    }
});

/**
 * Listens for events to be actioned on tab
 */
chrome.runtime.onMessage.addListener((request) => {
    // console.log('content.js', request);
    /**
     * Trigger Events
     */
    switch (request.trigger) {
        case 'closeFrame':
            removeFrame();
            return;
        default:
            // Do Nothing
    }
});

/**
 * Hide Content
 *
 * Hides page content with frame overlay.
 * Resolves with text content from page.
 *
 * @return {Promise<any>}
 */
const hideContent = () => {
    const page = $('html');
    page.hide();
    return new Promise((resolve) => {
        $(document).ready(() => {
            const body = $('body');
            body.css('overflow', 'hidden');
            body.prepend(frame);
            setTimeout(() => { // Allow time for iFrame to load
                page.show();
                resolve();
            }, 500);
        });
    });
};

/**
 * Parse Content
 *
 * At the moment this just gets the text content from a page and returns it.
 *
 * @param {*|jQuery|HTMLElement} element
 * @return {*}
 */
const parseContent = (element) => {
    return new Promise((resolve) => {
        setTimeout(() => { // Wait 3 seconds for network content to load
            const clone = element.clone();
            // Remove un-processable elements
            clone.find('iframe').remove();
            clone.find('script').remove();
            clone.find('noscript').remove();
            clone.find('style').remove();
            $.when(clone.find('*').each(function() {
                // Add whitespace to each element, prevents words being concatenated together when only separate by tags
                // eslint-disable-next-line
                $(this).append(' ');
                // Append title text into document to include in processing
                // eslint-disable-next-line
                if ($(this).attr('title')) {
                    // eslint-disable-next-line
                    $(this).append($(this).attr('title') + ' ');
                }
                // Append alt text into document to include in processing
                // eslint-disable-next-line
                if ($(this).attr('alt')) {
                    // eslint-disable-next-line
                    $(this).append($(this).attr('alt') + ' ');
                }
            })).then(() => {
                resolve(clone.text());
            });
        }, 3000);
    });
};

/**
 * Remove Overlay Frame
 */
const removeFrame = () => {
    $(document).ready(() => {
        const body = $('body');
        body.css('overflow', 'auto');
        frame.remove();
    });
};
