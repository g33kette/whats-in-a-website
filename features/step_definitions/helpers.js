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
            results.correct++;
            console.log('. ✓');
        } else {
            results.wrong++;
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
 * @param {int} ms
 * @return {Promise}
 */
exports.sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
