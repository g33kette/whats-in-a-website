/**
 * Content.js
 *
 * This script is injected into each tab. If the extension is enables it hides and reads the content and triggers
 * processing events.
 */

import $ from 'jquery';
import {OverlayFrameFactory} from './services/overlayFrameFactory';

const overlayFrameFactory = new OverlayFrameFactory(triggerActionFromFrame);
overlayFrameFactory.preloadContent();

/**
 * Div overlay screen - needed to ensure content is always hidden whilst iframes are swapping out
 *
 * @type {*|jQuery|HTMLElement}
 */
const overlayScreen = $('<div ' +
    'id="bp_overlay_screen" ' +
    'style="width: 100% !important; height: 100vh !important; top: 0 !important; right: 0 !important; ' +
    'background: #333333; ' +
    'position: fixed !important; z-index: 999999999999999999999999999999999999999999999999999 !important;">' +
    '</div>');

/**
 * IFrame training element
 *
 * @type {*|jQuery|HTMLElement}
 */
const trainingFrame = $('<iframe ' +
    'id="bp_training_frame" ' +
    'style="width: 100% !important; top: 25vh !important; right: 0 !important; ' +
    'border-top: solid 10px #7bff68 !important; border-bottom: solid 10px #7bff68 !important; ' +
    'box-shadow: 0px 15px 10px #000, 0px -15px 10px #000 !important; ' +
    'position: fixed !important; z-index: 999999999999999999999999999999999999999999999999999999999 !important;" ' +
    'src="'+chrome.runtime.getURL('pages/training_overlay.html')+'"></iframe>');

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
            //     console.log('content', content); // todo this is only needed when running collect_content feature
                chrome.runtime.sendMessage({trigger: 'initialiseProcessing', content: content});
            });
        });
    }
});

let overlayFrame;
const changeFrame = async (type, params) => {
    if (overlayFrame) {
        overlayFrame.remove();
    }
    const parent = $('body');
    switch (type) {
        case 'processing':
            overlayFrame = await overlayFrameFactory.injectProcessingFrame(parent, params.message);
            break;
        case 'complete':
            overlayFrame = await overlayFrameFactory.injectCompleteFrame(parent, params.result, params.summary);
            break;
        default:
            // Do nothing
    }
};
//
// window.addEventListener('message', (e) => {
//     if (e.origin === 'chrome-extension://'+chrome.runtime.id) {
//         console.log('RECEIVED', e);
//     }
// }, false);
/**
 * Listens for events to be actioned on tab
 */
chrome.runtime.onMessage.addListener((request) => {
    return new Promise((resolve) => {
        /**
         * Trigger Events
         */
        switch (request.trigger) {
            case 'showMessage':
                changeFrame('processing', request);
                return;
            case 'showAnalysis':
                changeFrame('complete', request);
                return;
            case 'closeFrame':
                removeOverlay();
                return;
            case 'showTrainingFrame':
                showTrainingFrame();
                return;
            case 'closeTrainingFrame':
                removeTrainingFrame();
                return;
            case 'markContentSafe':
                chrome.runtime.sendMessage({trigger: 'markContentSafe'});
                return;
            case 'markContentHarmful':
                chrome.runtime.sendMessage({trigger: 'markContentHarmful'});
                return;
            default:
            // Do Nothing
        }
        resolve();
    });
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
            body.css('height', '100vh');
            body.append(overlayScreen);
            // changeFrame(overlayFrameFactory.newReadingFrame()).then(() => {
                setTimeout(() => { // Allow time for iFrame to load
                    page.show();
                    resolve();
                }, 500);
            // });
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
const removeOverlay = () => {
    $(document).ready(() => {
        const body = $('body');
        body.css('overflow', 'auto');
        body.css('height', 'auto');
        overlayScreen.remove();
        if (overlayFrame) {
            overlayFrame.remove();
        }
    });
};

/**
 * Show Training Frame
 */
const showTrainingFrame = () => {
    $(document).ready(() => {
        const body = $('body');
        body.append(trainingFrame);
    });
};

/**
 * Remove Training Frame
 */
const removeTrainingFrame = () => {
    trainingFrame.remove();
};

/**
 * Trigger Action From Frame
 *
 * @param {string} trigger
 * @param {*} args
 */
function triggerActionFromFrame(trigger, ...args) {
    switch (trigger) {
        case 'closeTab':
            window.close();
            return;
        case 'closeOverlayFrame':
            removeOverlay();
            return;
        case 'showTrainingFrame':
            showTrainingFrame();
            return;
        case 'removeTrainingFrame':
            removeTrainingFrame();
            return;
        case 'sendMessage':
            chrome.runtime.sendMessage(...args);
            return;
        case 'goBack':
            history.back();
            return;
        default:
        // Un-recognised, do nothing
    }
}
