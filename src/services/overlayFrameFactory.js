
import $ from 'jquery';

/**
 * Overlay Frame
 *
 * @param {function} triggerAction
 * @constructor
 */
export function OverlayFrameFactory(triggerAction) {
    let initialised = false;
    let style;
    let processingContent;
    let completeContent;

    /**
     * New Overlay Frame
     *
     * @param {string} page
     * @return {Promise<*>}
     */
    function newOverlayFrame(page) {
        const iframe = $('<iframe></iframe>');
        iframe.css('width', '100%');
        iframe.css('height', '100%');
        iframe.css('top', '0');
        iframe.css('left', '0');
        iframe.css('position', 'fixed');
        iframe.css('z-index', '99999999999999999999999999999999999999999999999999999999999999999999999999999999999999');
        return iframe;
    }

    /**
     * Inject Content
     *
     * @param {*} parent
     * @param {*} frame
     * @param {*} content
     * @return {Promise<void>}
     */
    async function injectContent(parent, frame, content) {
        if (!style) {
            await initialise();
        }
        $(parent).append(frame);
        const context = frame[0].contentWindow.document;
        $('body', context).append(style);
        $('body', context).append(content);
    }

    this.preloadContent = () => initialise();
    this.injectProcessingFrame = async (parent, message) => {
        const frame = newOverlayFrame('reading');
        await injectContent(parent, frame, processingContent);
        const frameBody = $('body', frame[0].contentWindow.document);
        frameBody.find('.message').html(message);
        return frame;
    };

    this.injectCompleteFrame = async (parent, result, summary) => {
        const frame = newOverlayFrame('reading');
        await injectContent(parent, frame, completeContent);
        updateFrameWithAnalysisResult(frame, result, summary);
        return frame;
    };

    /**
     * Initialise
     * @return {Promise<any>}
     */
    function initialise() {
        return new Promise((resolve) => {
            if (!initialised) {
                initialised = true;
                $.get(chrome.runtime.getURL('assets/css/style.css')).then((css) => {
                    $.get(chrome.runtime.getURL('pages/protection_overlay_processing.html')).then((processingHtml) => {
                        $.get(chrome.runtime.getURL('pages/protection_overlay_complete.html')).then((completeHtml) => {
                            style = $('<style>'+css+'</style>');
                            processingContent = $(processingHtml);
                            completeContent = $(completeHtml);
                        });
                    });
                    resolve();
                });
            } else {
                waitForInitialisation().then(() => {
                    resolve();
                });
            }
        });
    }

    /**
     * Wait For Initialisation
     *
     * @return {Promise<any>}
     */
    function waitForInitialisation() {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (style) {
                    resolve();
                } else {
                    waitForInitialisation();
                }
            }, 200);
        });
    }

    /**
     * Show Analysis
     *
     * @param {object} frame
     * @param {object} result
     * @param {array} [summary]
     */
    function updateFrameWithAnalysisResult(frame, result, summary) {
        const frameBody = $('body', frame[0].contentWindow.document);
        const completeElement = frameBody.find('.complete');
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
        // Bind events for buttons
        completeElement.on('click', '.action-safe', function() {
            triggerAction('sendMessage', {trigger: 'markContentSafe'});
            triggerAction('closeOverlayFrame');
        });
        completeElement.on('click', '.action-harmful', function() {
            triggerAction('sendMessage', {trigger: 'markContentHarmful'});
            completeElement.find('.classification-actions').hide();
            completeElement.find('.after-harmful-actions').show();
        });
        completeElement.on('click', '.action-review', function() {
            triggerAction('closeOverlayFrame');
            triggerAction('showTrainingFrame');
        });
        completeElement.on('click', '#actionClose', function() {
            triggerAction('closeTab');
        });
        completeElement.on('click', '#actionGoBack', function() {
            triggerAction('goBack');
        });
    }

    /**
     * Convert List to HTML
     * @param {array} arr
     * @return {string}
     */
    function convertListToHtml(arr) {
        let bits = [];
        for (const row of arr) {
            bits.push('<li>'+row+'</li>');
        }
        return '<ul>'+bits.join('')+'</ul>';
    }
}
