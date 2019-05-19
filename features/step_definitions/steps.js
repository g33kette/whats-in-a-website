/* eslint-disable no-undef */
/* eslint-disable new-cap */

module.exports = function() {
    this.AfterStep(function(step, done) {
        // console.log('AfterStep: ' + step.getName());
        selectDefaultWindow(driver); // Reset driver
        done();
    });

    /**
     * When I go to "http://..."
     */
    this.When(/^I go to "([^"]*)"$/, function(url, callback) {
        helpers.loadPage(url).then(() => callback());
    });

    /**
     * Then I should see "... some text"
     */
    this.Then(/^I should see "([^"]*)"$/, function(arg1) {
        return driver.wait(until.elementsLocated(by.css('body')), 0, 1)
            .then(() => {
                // return the promise of an element to the following then.
                return driver.findElements(by.css('body'));
            }).then(function(elements) {
                // verify this element has children
                helpers.getElementsContainingText('*', arg1).then((found) => {
                    expect(found.length).to.not.equal(0);
                });
            }, 5000);
    });

    /**
     * Then I should see protection overlay
     */
    this.Then(/^I should see protection overlay$/, function() {
        return driver.wait(until.elementsLocated(by.css('#bp_overlay_frame')), 0, 1);
    });

    /**
     * Then I should see protection training
     */
    this.Then(/^I should see protection training$/, function() {
        return driver.wait(until.elementsLocated(by.css('#bp_training_frame')), 0, 1);
    });

    /**
     * When content analysis is complete
     */
    this.When(/^content analysis is complete$/, async function() {
        await selectBpFrame(driver);
        return driver.wait(async () => {
            await driver.wait(until.elementsLocated(by.css('.complete')));
            const els = await driver.findElements(by.css('.complete'));
            return await els[0].isDisplayed();
        });
    });

    this.Then(/^the classification result should be "([^"]*)"$/, async function(classification) {
        await selectBpFrame(driver);
        return driver.wait(async () => {
            await driver.wait(until.elementsLocated(by.css('.result')));
            const els = await driver.findElements(by.css('.result'));
            const visible = await els[0].isDisplayed();
            const text = await els[0].getText();
            return !!(visible && text === classification);
        });
    });

    this.Then(/^I continue to website$/, async function() {
        await selectBpFrame(driver);
        return driver.wait(async () => {
            await driver.wait(until.elementsLocated(by.css('#actionContinue')));
            const els = await driver.findElements(by.css('#actionContinue'));
            const visible = await els[0].isDisplayed();
            if (visible) {
                await els[0].click();
                await selectDefaultWindow(driver);
                return true;
            } else {
                return false;
            }
        });
    });

    this.Then(/^I mark page as "([^"]*)"$/, async function(classification) {
        await selectBpTrainingFrame(driver);
        const selector = classification === 'safe'?'#actionMarkSafe'
            :(classification === 'harmful'?'#actionMarkHarmful'
                :null);
        return driver.wait(async () => {
            await driver.wait(until.elementsLocated(by.css(selector)));
            const els = await driver.findElements(by.css(selector));
            const visible = await els[0].isDisplayed();
            if (visible) {
                await els[0].click();
                await selectDefaultWindow(driver);
                return true;
            } else {
                return false;
            }
        });
    });
};

let subFrameActive = false;

/**
 * Switch To Browser Protect iFrame
 *
 * @param {object} driver
 */
async function selectBpFrame(driver) {
    await driver.wait(until.elementsLocated(by.css('#bp_overlay_frame')));
    subFrameActive = true;
    await driver.switchTo().frame('bp_overlay_frame');
    return true;
}

/**
 * Switch To Browser Protect Training iFrame
 *
 * @param {object} driver
 */
async function selectBpTrainingFrame(driver) {
    await driver.wait(until.elementsLocated(by.css('#bp_training_frame')));
    subFrameActive = true;
    await driver.switchTo().frame('bp_training_frame');
    return true;
}

/**
 * Switch To Default Window
 *
 * @param {object} driver
 */
async function selectDefaultWindow(driver) {
    if (subFrameActive) {
        subFrameActive = false;
        await driver.switchTo().defaultContent();
    }
    return true;
}
