
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
    let trainingContent;

    /**
     * Pre-Load Content
     *
     * @return {Promise<any>}
     */
    this.preloadContent = () => initialise();

    /**
     * Inject Processing Frame
     *
     * @param {*} parent
     * @param {string}  message
     * @return {Promise<*>}
     */
    this.injectProcessingFrame = async (parent, message) => {
        const frame = newOverlayFrame('bp_overlay_frame');
        await injectContent(parent, frame, processingContent);
        updateFrameWithMessage(frame, message);
        return frame;
    };

    /**
     * Inject Complete Frame
     *
     * @param {*} parent
     * @param {string} message
     * @param {*} result
     * @param {*} summary
     * @return {Promise<*>}
     */
    this.injectCompleteFrame = async (parent, message, result, summary) => {
        const frame = newOverlayFrame('bp_overlay_frame');
        await injectContent(parent, frame, completeContent);
        updateFrameWithAnalysisResult(frame, message, result, summary);
        return frame;
    };

    /**
     * Inject Training Frame
     *
     * @param {*} parent
     * @return {Promise<*>}
     */
    this.injectTrainingFrame = async (parent) => {
        const frame = newOverlayFrame('bp_training_frame');
        await injectContent(parent, frame, trainingContent);
        updateFrameWithTrainingOptions(frame);
        return frame;
    };

    // Private Methods -------------------------------------------------------------------------------------------------

    /**
     * New Overlay Frame
     *
     * @param {string} id
     * @return {Promise<*>}
     */
    function newOverlayFrame(id) {
        const iframe = $('<iframe></iframe>');
        iframe.css('width', '100%');
        iframe.css('height', '100%');
        iframe.css('top', '0');
        iframe.css('left', '0');
        iframe.css('position', 'fixed');
        iframe.css('z-index', '99999999999999999999999999999999999999999999999999999999999999999999999999999999999999');
        iframe.attr('id', id);
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
        $('body', context).css('margin', 0);
        $('body', context).addClass('browser-protect');
    }

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
                            $.get(chrome.runtime.getURL('pages/training_overlay.html')).then((trainingHtml) => {
                                style = $('<style>'+css+'</style>');
                                processingContent = $(processingHtml);
                                completeContent = $(completeHtml);
                                trainingContent = $(trainingHtml);
                            });
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
                    waitForInitialisation().then(() => resolve());
                }
            }, 200);
        });
    }

    /**
     * Show Message
     *
     * @param {object} frame
     * @param {string} message
     */
    function updateFrameWithMessage(frame, message) {
        const frameBody = $('body', frame[0].contentWindow.document);
        frameBody.find('.message').html(message);
    }

    /**
     * Show Analysis
     *
     * @param {object} frame
     * @param {string} message
     * @param {object} result
     * @param {array} [summary]
     */
    function updateFrameWithAnalysisResult(frame, message, result, summary) {
        updateFrameWithMessage(frame, message);
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
            // Also show confidences
            completeElement.find('.classification-model').html(result.model);
            if (result.confidence) {
                completeElement.find('.classification-confidence').html(result.confidence);
            } else {
                completeElement.find('.classification-confidence-container').hide();
            }
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
            frameBody.find('.processing-training').show();
            triggerAction('sendMessage', {trigger: 'markContentSafe'}, () => {
                triggerAction('closeOverlayFrame');
            });
        });
        completeElement.on('click', '.action-harmful', function() {
            frameBody.find('.processing-training').show();
            triggerAction('sendMessage', {trigger: 'markContentHarmful'}, () => {
                frameBody.find('.processing-training').hide();
                completeElement.find('.classification-actions').hide();
                completeElement.find('.after-harmful-actions').show();
            });
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
     * Show Training Options
     *
     * @param {object} frame
     */
    function updateFrameWithTrainingOptions(frame) {
        // Move iFrame location, this one does not need to fill screen
        frame.css('top', '25vh');
        frame.css('border-top', 'solid 10px #7bff68');
        frame.css('border-bottom', 'solid 10px #7bff68');
        frame.css('box-shadow', '0px 15px 10px #000, 0px -15px 10px #000');
        frame.css('height', 'auto');

        const frameBody = $('body', frame[0].contentWindow.document);
        const trainingElement = frameBody.find('#bp_training');

        // Bind events for buttons
        trainingElement.on('click', '#actionMarkSafe', function() {
            trainingElement.find('.processing-training').show();
            triggerAction('sendMessage', {trigger: 'markContentSafe'}, () => {
                triggerAction('removeTrainingFrame');
            });
        });
        trainingElement.on('click', '#actionMarkHarmful', function() {
            trainingElement.find('.processing-training').show();
            triggerAction('sendMessage', {trigger: 'markContentHarmful'}, () => {
                trainingElement.find('.processing-training').hide();
                trainingElement.find('#actionClose').show();
                trainingElement.find('.after-harmful-actions').show();
                trainingElement.find('.training-action').hide();
            });
        });
        trainingElement.on('click', '#actionHideTrainingFrame', function() {
            triggerAction('removeTrainingFrame');
        });
        trainingElement.on('click', '#actionClose', function() {
            triggerAction('closeTab');
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
