/**
 * Content.js
 *
 * This script is injected into each tab. If the extension is enables it hides and reads the content and triggers
 * processing events.
 */

import $ from 'jquery';

/**
 * IFrame overlay element
 *
 * @type {*|jQuery|HTMLElement}
 */
const overlayScreen = $('<div ' +
    'id="bp_overlay_screen" ' +
    'style="width: 100% !important; height: 100vh !important; top: 0 !important; right: 0 !important; ' +
    'background: #333333; ' +
    'position: fixed !important; z-index: 999999999999999999999999999999999999999999999999999 !important;">' +
    '</div>');

const style = $(`<style>
/**
 * Scope general styles inside "browser-protect" class
 */
.browser-protect {
    color: #7bff68;
    background: #2e2e2e;
    font-family: 'Share Tech Mono', monospace;
}
    .browser-protect h1,
    .browser-protect h2,
    .browser-protect h3,
    .browser-protect h4,
    .browser-protect #h5 {
        font-weight: normal;
    }

    .browser-protect hr {
        border-color: #666666;
        color: #666666;
        border-style: solid;
        border-width: 1px;
    }

    .browser-protect label {}

    .browser-protect .tag {
        display: inline-block;
        padding: 5px;
        border-radius: 2px;
    }
        .browser-protect .tag.tag-success {
            background-color: #7bff68;
            color: #000000;
        }
        .browser-protect .tag.tag-danger {
            background-color: #ff2c2c;
            color: #ffffff;
        }
        .browser-protect .tag.tag-disabled {
            background-color: #888888;
            color: #eeeeee;
        }

    .browser-protect button, .browser-protect a.button,
    .browser-protect a.button:active,
    .browser-protect a.button:focus,
    .browser-protect a.visited {
        padding: 7px 12px;
        border-radius: 5px;
        background-color: #bbbbbb;
        color: #000000;
        font-weight: bold;
        cursor: pointer;
        font-family: 'Share Tech Mono', monospace;
        text-decoration: none;
        font-size: .9em;
        border-width: 3px;
        margin: .3em;
    }
    .browser-protect button:hover,
    .browser-protect a.button:hover {
        background-color: #eeeeee;
    }

    .browser-protect .actions {}
        .browser-protect .actions button.action-safe {
            font-weight: normal;
            background-color: #67d657;
            border-color: #7bff68;
        }
        .browser-protect .actions button.action-safe:hover {
            background-color: #7bff68;
        }
        .browser-protect .actions button.action-harmful {
            font-weight: normal;
            background-color: #cb2323;
            color: #ffffff;
            border-color: #ff2c2c;
        }
        .browser-protect .actions button.action-harmful:hover {
            background-color: #ff2c2c;
        }
        .browser-protect .actions button.action-review {
            font-weight: normal;
            color: #ffb15c;
            background-color: #555555;
            border-color: #999999;
        }
        .browser-protect .actions button.action-review:hover {
            background-color: #666666;
        }

    .browser-protect .align-left {
        float: left;
    }
    .browser-protect .align-right {
        float: right;
    }
    .browser-protect .clear-float {
        clear: both;
        display: block;
    }


    .browser-protect .result {
        display: inline-block;
        padding: 10px;
        text-transform: capitalize;
        font-weight: normal;
        border-radius: 3px;
    }
        .browser-protect .result.safe {
            background-color: #7bff68;
            color: #333;
        }
        .browser-protect .result.harmful {
            background-color: #ff2c2c;
            color: #ffffff;
        }
        .browser-protect .result.warning {
            background-color: #ffb15c;
            color: #333;
        }

    .browser-protect .after-harmful-actions {
        color: #ccc;
    }
        .browser-protect .after-harmful-actions .result {
            font-size: .9em;
            font-weight: normal;
        }

    .browser-protect .footer {
        color: #666666;
        position: fixed;
        bottom: 0;
        background: #000;
        width: 100%;
        text-align: center;
    }
        .browser-protect .footer .bpText {
            font-weight: bold;
            font-style: italic;
            color: #7ae721;
        }
        .browser-protect .footer .logo {
            margin-bottom: -8px;
        }

    /**
     * Scope content overly within "bp" ID
     */
#bp {
    z-index: 999999999999999999999999999999999999999999999999999999999; /* Ensure this is displayed above ANY content */
    font-size: 17px;
    height: 100%;
    min-height: 100vh;
    margin: 0;
    overflow: auto;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
}
    #bp .main-content {
        margin: 100px 0;
    }
        #bp .main-content .message {}

        #bp .main-content .loading {
            position: relative;
            top: 35%;
        }
            #bp .main-content .loading i {
                font-size: 30px;
                margin: 40px 20px;
                color: #666666;
            }
        #bp .main-content .complete {}

            #bp .main-content .complete .classification-actions-container {}
                #bp .main-content .complete .classification-actions-container .actions {
                    display: none;
                    color: #fff;
                }
                    #bp .main-content .complete .classification-actions-container .actions.after-harmful-actions {
                        color: #ccc;
                    }

            #bp .main-content .complete .classification-container {
                color: #ffffff;
            }
                #bp .main-content .complete .classification-container  h3 {
                    font-weight: normal;
                    display: inline-block;
                }
            #bp .main-content .complete .classification-message,
            #bp .main-content .complete .classification-required {
                font-size: .9em;
                font-weight: normal;
                color: #999;
                width: 800px;
                max-width: 90%;
                margin: auto;
            }
                #bp .main-content .complete .classification-message .result,
                #bp .main-content .complete .classification-required .result {
                    padding: 5px;
                    font-weight: normal;
                }
            #bp .main-content .complete .summary-container {
                display: none;
                text-align: left;
                color: #fff;
                width: 800px;
                margin: auto;
                font-size: .9em;
                max-width: 90%;
                border-top: #000 solid 1px;
            }
            #bp .main-content .complete .summary-container p {}
            #bp .main-content .complete .summary-container ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
                #bp .main-content .complete .summary-container ul li {
                        margin: 2px;
                        background: #555;
                        padding: 6px 12px;
                        display: inline-block;
                }
                    #bp .main-content .complete .summary-container ul li:nth-child(odd) {
                        background: #777;
                    }
    #bp .actions {
        margin: 2em;
    }
/**
 * Scope "browser_action" menu within "bp_menu" ID
 */
#bp_menu {
    width: 400px;
    font-size: 12px;
}
    #bp_menu.browser-protect button, #bp_menu.browser-protect a.button  {
        font-size: 1em;
    }
    #bp_menu hr {
        margin-bottom: 15px;
    }
    #bp_menu .bp-menu-login {}
        #bp_menu .bp-menu-login > div {
            margin: 15px;
        }
            #bp_menu .bp-menu-login > div label {
                font-size: 1.3em;
            }
            #bp_menu .bp-menu-login > div input {
                padding: 3px;
                border-radius: 2px;
            }
    #bp_menu .option {
        padding: 10px;
        background-color: #555;
    }
    #bp_menu .option:nth-child(odd) {
        background-color: #444;
    }
        #bp_menu .option .option-label {
            padding: 8px;
            float: left;
        }
        #bp_menu .option .option-actions {
            float: right;
        }
/**
 * Scope content overly within "bp_training" ID
 */
#bp_training {
    z-index: 999999999999999999999999999999999999999999999999999999999; /* Ensure this is displayed above ANY content */
    font-size: 17px;
    margin: 0;
    overflow: auto;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
}
    #bp_training .main-content {
        position: relative;
        margin-top: 10px;
        min-height: 80px;
    }
    #bp_training .main-content .actions {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
    }
</style>`);

const content = `
<div class="browser-protect" id="bp">
    <div class="main-content">
        <h2 class="message"></h2>
        <div class="processing">
            <div class="loading">
                <div class="loading-status">
                    <i class="fas fa-cog fa-spin"></i>
                    <i class="fas fa-cog fa-spin"></i>
                    <i class="fas fa-cog fa-spin"></i>
                </div>
            </div>
        </div>
        <div class="complete">
            <div class="classification-container">
                <h3>Predicted Page Classification:</h3>
                <p class="result" id="result"></p>
            </div>
            <p class="classification-message" style="display:none"></p> <!-- hidden by default -->
            <div class="classification-required" style="display:none"> <!-- hidden by default -->
                <p>This website cannot be classified.</p>
                <p>
                    Browser Protect requires training before it can predict
                    whether a website is safe or harmful. To do this, please visit and classify websites that you
                    consider safe and harmful, you must classify at least one of each.
                </p>
                <p>
                    In the future, more training will make the predictions more accurate. Training is saved
                    when you choose a <span class="result safe">Safe</span> or
                    <span class="result harmful">Harmful</span> action.
                </p>
            </div>
            <div class="classification-actions-container"><!-- Note, all children are initially hidden by CSS -->
                <div class="actions classification-actions classification-actions-safe">
                    <h2>Is the predicted classification correct?</h2>
                    <button class="action-safe">Yes, Continue to Website</button>
                    <button class="action-harmful">No, Mark as Harmful</button>
                    <button class="action-review">Not Sure, Continue and Review</button>
                </div>
                <div class="actions classification-actions classification-actions-harmful">
                    <h2>Is the predicted classification correct?</h2>
                    <button class="action-safe">No, Mark as Safe and Continue</button>
                    <button class="action-harmful">Yes, Save Harmful Classification</button>
                    <button class="action-review">Not Sure, Continue and Review</button>
                </div>
                <div class="actions classification-actions classification-actions-unknown">
                    <h2>Should this page be classified as safe?</h2>
                    <button class="action-safe">Yes, Continue to Website</button>
                    <button class="action-harmful">No, Mark as Harmful</button>
                    <button class="action-review">Not Sure, Continue and Review</button>
                </div>
                <div class="actions after-harmful-actions">
                    <p>
                        <i class="fas fa-check"></i>
                        Thank you, this website has been marked as <span class="result harmful">harmful</span>
                    </p>
                    <button id="actionClose">Close Tab</button>
                    <button id="actionGoBack">Back to Previous Page</button>
                </div>
            </div>
            <div class="summary-container">
                <h3>Content Key Terms:</h3>
                <p class="summary"></p>
            </div>
        </div>
    </div>
    <div class="footer">
        <p>
            Browsing Protected by
            <img src="../assets/img/logo24.png" class="logo" alt="Browser Protect Logo">
            <span class="bpText">BrowserProtect</span>
        </p>
    </div>
</div>
`;
/**
 * IFrame overlay element
 *
 * @type {*|jQuery|HTMLElement}
 */
const overlayFrames = [
    $('<iframe ' +
        'style="width: 100% !important; height: 100% !important; top: 0 !important; left: 0 !important; ' +
        'position: absolute !important; background-color: magenta !important;' +
        'z-index: 999999999999999999999999999999999999999999999999999999999 !important;">' +
        '</iframe>'),
    $('<iframe ' +
        'style="width: 100% !important; height: 100% !important; top: 0 !important; left: 0 !important; ' +
        'position: absolute !important; background-color: blue !important;' +
        'z-index: 999999999999999999999999999999999999999999999999999999999 !important;">' +
        '</iframe>'),
    $('<iframe ' +
        'style="width: 100% !important; height: 100% !important; top: 0 !important; left: 0 !important; ' +
        'position: absolute !important; background-color: yellow !important;' +
        'z-index: 999999999999999999999999999999999999999999999999999999999 !important;">' +
        '</iframe>'),
    $('<iframe ' +
        'style="width: 100% !important; height: 100% !important; top: 0 !important; left: 0 !important; ' +
        'position: absolute !important; background-color: orange !important;' +
        'z-index: 999999999999999999999999999999999999999999999999999999999 !important;">' +
        '</iframe>'),
    $('<iframe ' +
        'style="width: 100% !important; height: 100% !important; top: 0 !important; left: 0 !important; ' +
        'position: absolute !important; background-color: cyan !important;' +
        'z-index: 999999999999999999999999999999999999999999999999999999999 !important;">' +
        '</iframe>'),
    $('<iframe ' +
        'style="width: 100% !important; height: 100% !important; top: 0 !important; left: 0 !important; ' +
        'position: absolute !important; background-color: green !important;' +
        'z-index: 999999999999999999999999999999999999999999999999999999999 !important;">' +
        '</iframe>'),
];
let overlayFrame = overlayFrames[0];
// const overlayFrame = $('<iframe ' +
//     'id="bp_overlay_frame" ' +
//     'style="width: 100% !important; height: 100vh !important; top: 0 !important; right: 0 !important; ' +
//     'position: fixed !important; z-index: 999999999999999999999999999999999999999999999999999999999 !important;" ' +
//     'src="'+chrome.runtime.getURL('pages/protection_overlay.html')+'"></iframe>');

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

const changeFrame = (index) => {
    overlayFrame.remove();
    overlayFrame = overlayFrames[index];
    $('body').append(overlayFrame);
    const context = overlayFrame[0].contentWindow.document;
    $('body', context).append(style);
    $('body', context).append(content);
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
        // const frame = document.getElementById('bp_overlay_frame');
        switch (request.trigger) {
            case 'showMessage':
                console.log('CONTENT', parseInt(request.message.match(/^\[(\d+)\]/)[1]), request.message);
                changeFrame(parseInt(request.message.match(/^\[(\d+)\]/)?request.message.match(/^\[(\d+)\]/)[1]:0));
                return;
            //     frame.contentWindow.document.open('text/html', 'replace');
            //     frame.contentWindow.document.write('<p>'+request.message+'</p>');
            //     frame.contentWindow.document.close();
            //     frame.contentWindow.postMessage('request.message', '*');
            //     return;
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
            body.append(overlayFrame);
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
const removeOverlay = () => {
    $(document).ready(() => {
        const body = $('body');
        body.css('overflow', 'auto');
        body.css('height', 'auto');
        overlayFrame.remove();
        overlayScreen.remove();
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
