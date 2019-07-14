/* eslint-disable no-undef */
/* eslint-disable new-cap */

/**
 * Go To URL
 * @param {string} url
 * @return {Promise}
 */
exports.goToUrl = (url) => helpers.loadPage(url);

/**
 * Element With Text Exists
 * @param {string} text
 * @param {*} driver
 * @return {Promise}
 */
exports.elementWithTextExists = (text, driver) => {
    return driver.wait(until.elementsLocated(by.css('body')), 0, 1)
        .then(() => {
            helpers.getElementsContainingText('*', text).then((found) => {
                expect(found.length).to.not.equal(0);
            });
        }, 5000);
};

/**
 * Assert Protection Overlay
 * @param {*} driver
 * @return {Promise}
 */
exports.assertProtectionOverlay = (driver) => driver.wait(until.elementsLocated(by.css('#bp_overlay_frame')), 0, 1);

/**
 * Assert Protection Training Window
 * @param {*} driver
 * @return {Promise}
 */
exports.assertProtectionTraining = (driver) => driver.wait(until.elementsLocated(by.css('#bp_training_frame')), 0, 1);

/**
 * Content Previously Extracted
 *
 * @param {string} url
 * @param {string} classification
 * @param {string} contentType
 * @return {Promise}
 */
exports.contentPreviouslyExtracted = (url, classification, contentType) => {
    return new Promise(async (resolve) => {
        const filePath = __dirname+'/../../tests/data/'+contentType+'/'+classification+'/';
        const fileName = buildFileNameFromUrl(url);
        const fs = require('fs');
        fs.access(filePath + fileName, fs.F_OK, (err) => {
            resolve(!(err));
        });
    });
};

/**
 * Save Parsed Content To File
 * @param {string} url
 * @param {string} classification
 * @param {string} contentType
 * @param {*} driver
 * @return {Promise}
 */
exports.saveParsedContentToFile = (url, classification, contentType, driver) => {
    return new Promise(async (resolve) => {
        // Read from logs
        const getLogs = await driver.manage().logs().get('browser');
        let content = '';
        for (const log of getLogs) {
            // 'chrome-extension://heaikljhfbhlemebdocookpopjidoico/content.js 38:85082 "content" "....
            if (log.message.match(/^chrome-extension:\/\/(\w+)\/content.js (\d+):(\d+) "content" "/)) {
                content = log.message
                    .replace(
                        /chrome-extension:\/\/(\w+)\/content.js (\d+):(\d+) "content" "/,
                        ''
                    )
                    .slice(0, -1)
                    .replace(/\\n/g, '\r\n');
            }
        }
        if (content === '') {
            // No content, return with error
            throw new Error('Content for '+url+' not found.');
        }

        const filePath = __dirname+'/../../tests/data/'+contentType+'/'+classification+'/';
        const fileName = buildFileNameFromUrl(url);

        const fs = require('fs');
        fs.writeFile(filePath + fileName, content.replace(/\\n/g, '\r\n'), (err) => {
            if (err) throw err;
            resolve();
        });
    });
};

/**
 * Content Analysis Complete
 * @param {*} driver
 * @return {Promise}
 */
exports.contentAnalysisComplete = async (driver) => {
    const els = await driver.findElements(by.css('.complete'));
    if (!els.length || !await els[0].isDisplayed()) {
        throw new Error();
    }
    // Else
    return true;
};

/**
 * Update Frame
 *
 * @param {function} selectFrameFunction
 * @param {*} driver
 * @param {function} callBack
 * @param {int} [timeout] - Timeout value defaults to 30s
 * @param {int} [stop] - Time in future that loop should expire
 * @return {Promise}
 */
exports.keepUpdatingFrame = (selectFrameFunction, driver, callBack, timeout, stop) => {
    if (!timeout) {
        timeout = 30000; // 30 seconds
    }
    if (!stop) {
        stop = (new Date().getTime()) + timeout;
    }
    return new Promise((resolve, reject) => {
        selectFrameFunction(driver)
            .then(() => {
                return callBack();
            })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                if (stop < (new Date().getTime())) {
                    // Time to stop
                    reject(error);
                } else {
                    // Loop
                    return exports.keepUpdatingFrame(selectFrameFunction, driver, callBack, timeout, stop);
                }
            })
            .then((result) => resolve(result))
            .catch((error) => reject(error));
    });
};

/**
 * Match Classification Result
 * @param {string} classification
 * @param {*} driver
 * @return {Promise}
 */
exports.matchClassificationResult = (classification, driver) => {
    return driver.wait(async () => {
        await driver.wait(until.elementsLocated(by.css('#result')));
        const els = await driver.findElements(by.css('#result'));
        if (!els.length) return false;
        const visible = await els[0].isDisplayed();
        const text = await els[0].getText();
        return !!(visible && text.toLowerCase() === classification.toLowerCase());
    });
};

/**
 * Check Classification Result
 * @param {string} classification
 * @param {object} results
 * @param {*} driver
 * @return {Promise}
 */
exports.checkClassificationResult = (classification, results, driver) => {
    return driver.wait(async () => {
        await driver.wait(until.elementsLocated(by.css('#result')));
        const els = await driver.findElements(by.css('#result'));
        if (!els.length) return false;
        const visible = await els[0].isDisplayed();
        if (!visible) return false;
        const text = await els[0].getText();
        if (text === classification) {
            if (classification.toLowerCase() === 'safe') {
                results.tp++;
            } else {
                results.tn++;
            }
            console.log('. ✓');
        } else {
            if (classification.toLowerCase() === 'safe') {
                results.fn++;
            } else {
                results.fp++;
            }
            console.log('. X');
        }
        return true;
    });
};

/**
 * Click Continue To Website
 * @param {*} driver
 * @param {function} [revertDriverCallback]
 * @return {Promise}
 */
exports.clickContinueToWebsite = (driver, revertDriverCallback) => {
    return driver.wait(async () => {
        await driver.wait(until.elementsLocated(by.css('.action-review')));
        const els = await driver.findElements(by.css('.action-review'));
        if (!els.length) return false;
        let visible;
        let el;
        for (el of els) {
            visible = await el.isDisplayed();
            if (visible) {
                break;
            }
        }
        if (visible) {
            await el.click();
            if (revertDriverCallback) {
                await revertDriverCallback(driver);
            }
            return true;
        } else {
            return false;
        }
    });
};

/**
 * Set Page Classification
 * @param {string} classification
 * @param {*} driver
 * @param {function} [revertDriverCallback]
 * @return {Promise}
 */
exports.setPageClassification = (classification, driver, revertDriverCallback) => {
    let selector = classification === 'safe'?'#actionMarkSafe,.action-safe'
        :(classification === 'harmful'?'#actionMarkHarmful,.action-harmful'
            :null);
    return driver.wait(async () => {
        await driver.wait(until.elementsLocated(by.css(selector)));
        let els = await driver.findElements(by.css(selector));
        if (!els.length) return false;
        let visible;
        let el;
        for (el of els) {
            visible = await el.isDisplayed();
            if (visible) {
                break;
            }
        }
        if (visible) {
            await el.click();
            if (revertDriverCallback) {
                await revertDriverCallback(driver);
            }
            return true;
        } else {
            return false;
        }
    });
};

/**
 * Sleep
 * @param {int} s
 * @return {Promise}
 */
exports.sleep = (s) => {
    return new Promise((resolve) => setTimeout(resolve, s*1000));
};

// Other Methods -------------------------------------------------------------------------------------------------------

/**
 * Build File Name From URL
 *
 * @param {string} url
 * @return {string}
 */
function buildFileNameFromUrl(url) {
    return url
        .replace(/\//g, '.')
        .replace(/(\?)/g, '+')
        .replace(/[^\\.\\=\\&\\-\\+_A-z0-9]+/g, '')
        .substr(0, 180) // Filenames too long was causing git issues
        .replace(/^\.|\.$/g, ''); // trailing slash replaced by . was causing file issues
}
