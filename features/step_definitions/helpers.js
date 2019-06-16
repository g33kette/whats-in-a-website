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
 * @param {*} driver
 * @return {Promise}
 */
exports.contentPreviouslyExtracted = (url, classification) => {
    return new Promise(async (resolve) => {
        const filePath = __dirname+'/../../tests/data/training/'+classification+'/';
        const fileName = url
            .replace(/\//g, '.')
            .replace(/(\?)/g, '+')
            .replace(/[^\\.\\=\\&\\-\\+_A-z0-9]+/g, '');

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
 * @param {*} driver
 * @return {Promise}
 */
exports.saveParsedContentToFile = (url, classification, driver) => {
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

        const filePath = __dirname+'/../../tests/data/training/'+classification+'/';
        const fileName = url
            .replace(/\//g, '.')
            .replace(/(\?)/g, '+')
            .replace(/[^\\.\\=\\&\\-\\+_A-z0-9]+/g, '');

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
exports.contentAnalysisComplete = (driver) => {
    return driver.wait(async () => {
        await driver.wait(until.elementsLocated(by.css('.complete')));
        const els = await driver.findElements(by.css('.complete'));
        if (!els.length) return false;
        return await els[0].isDisplayed();
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
        await driver.wait(until.elementsLocated(by.css('.result')));
        const els = await driver.findElements(by.css('.result'));
        if (!els.length) return false;
        const visible = await els[0].isDisplayed();
        const text = await els[0].getText();
        return !!(visible && text === classification);
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
        await driver.wait(until.elementsLocated(by.css('.result')));
        const els = await driver.findElements(by.css('.result'));
        if (!els.length) return false;
        const visible = await els[0].isDisplayed();
        if (!visible) return false;
        const text = await els[0].getText();
        if (text === classification) {
            if (classification === 'safe') {
                results.tp++;
            } else {
                results.tn++;
            }
            console.log('. ✓');
        } else {
            if (classification === 'safe') {
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
        await driver.wait(until.elementsLocated(by.css('#actionContinue')));
        const els = await driver.findElements(by.css('#actionContinue'));
        if (!els.length) return false;
        const visible = await els[0].isDisplayed();
        if (visible) {
            await els[0].click();
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
    const selector = classification === 'safe'?'#actionMarkSafe'
        :(classification === 'harmful'?'#actionMarkHarmful'
            :null);
    return driver.wait(async () => {
        await driver.wait(until.elementsLocated(by.css(selector)));
        const els = await driver.findElements(by.css(selector));
        if (!els.length) return false;
        const visible = await els[0].isDisplayed();
        if (visible) {
            await els[0].click();
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
