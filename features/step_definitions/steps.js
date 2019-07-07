/* eslint-disable no-undef */
/* eslint-disable new-cap */

const stepHelpers = require('./helpers');

module.exports = function() {
    this.AfterStep(function(step, done) {
        // console.log('AfterStep: ' + step.getName());
        selectDefaultWindow(driver); // Reset driver
        done();
    });

    /**
     * When I go to "http://..."
     */
    this.When(/^I go to "([^"]*)"$/, stepHelpers.goToUrl);

    /**
     * Then I should see "... some text"
     */
    this.Then(/^I should see "([^"]*)"$/, function(arg1) {
        return stepHelpers.elementWithTextExists(arg1, driver);
    });

    /**
     * Then I should see "... some text" in protection overlay
     */
    this.Then(/^I should see "([^"]*)" in protection overlay$/, function(arg1) {
        return selectBpFrame(driver).then(() => {
            return stepHelpers.elementWithTextExists(arg1, driver);
        });
    });

    /**
     * Then I should see protection overlay
     */
    this.Then(/^I should see protection overlay$/, function() {
        return stepHelpers.assertProtectionOverlay(driver);
    });

    /**
     * Then I should see protection training
     */
    this.Then(/^I should see protection training$/, function() {
        return stepHelpers.assertProtectionTraining(driver);
    });

    /**
     * When content analysis is complete
     */
    this.When(/^content analysis is complete$/, {timeout: 60000}, function() {
        return selectBpFrame(driver).then(() => {
            return stepHelpers.contentAnalysisComplete(driver);
        });
    });

    /**
     * Then the classification result should be "safe"
     */
    this.Then(/^the classification result should be "([^"]*)"$/, function(classification) {
        return selectBpFrame(driver).then(() => {
            return stepHelpers.matchClassificationResult(classification, driver);
        });
    });

    /**
     * Then I continue to website
     */
    this.Then(/^I continue to website$/, function() {
        return selectBpFrame(driver).then(() => {
            return stepHelpers.clickContinueToWebsite(driver, selectDefaultWindow);
        });
    });

    /**
     * Then I mark page as "safe"
     */
    this.Then(/^I mark page as "([^"]*)"$/, function(classification) {
        return selectBpTrainingFrame(driver).then(() => {
            return stepHelpers.setPageClassification(classification, driver, selectDefaultWindow);
        });
    });


    /**
     * Then I mark page as "safe" in protection overlay
     */
    this.Then(/^I mark page as "([^"]*)" in protection overlay$/, function(classification) {
        return selectBpFrame(driver).then(() => {
            return stepHelpers.setPageClassification(classification, driver, selectDefaultWindow);
        });
    });

    /**
     * Given the model is trained with the following classifications
     *  | url | classification |
     */
    this.Given(/^the model is trained with the following classifications$/, {timeout: 3000000}, function(args) {
        console.log('Training ('+(args.raw().length)+' classifications): ');
        let progress = 0;
        return driver.wait(async () => {
            for (const row of args.raw()) {
                console.log('. ' + ++progress);
                console.log(row[0]);
                // console.log(row);
                const url = row[0];
                const classification = row[1];
                await selectDefaultWindow(driver);
                // Go to URL
                await stepHelpers.goToUrl(url);
                // Wait for processing to complete
                await selectBpFrame(driver);
                await stepHelpers.contentAnalysisComplete(driver);
                // Click to continue to view site
                await stepHelpers.clickContinueToWebsite(driver, selectDefaultWindow);
                // Click classification
                await selectDefaultWindow(driver);
                await stepHelpers.assertProtectionTraining(driver);
                await selectBpTrainingFrame(driver);
                await stepHelpers.setPageClassification(classification, driver, selectDefaultWindow);
            }
            return true;
        });
    });

    /**
     * Given content is extracted for the following websites
     *  | url | classification |
     */
    this.Given(
        /^(training|testing|validation) content is extracted for the following websites$/,
        {timeout: 3000000},
        function(contentType, args) {
            return driver.wait(async () => {
                for (const row of args.raw()) {
                    const url = row[0];
                    const classification = row[1];
                    console.log('. ');
                    console.log(url);

                    if (await stepHelpers.contentPreviouslyExtracted(url, classification, contentType)) {
                        continue;
                    }

                    console.log('Extracting.');

                    await selectDefaultWindow(driver);
                    // Go to URL
                    await stepHelpers.goToUrl(url);
                    // Wait for processing to complete
                    await selectBpFrame(driver);
                    await stepHelpers.contentAnalysisComplete(driver);

                    // Save content from console logs to file
                    await stepHelpers.saveParsedContentToFile(url, classification, contentType, driver);

                    console.log('Done.');
                }
                return true;
            });
        }
    );

    /**
     * Then the following classifications are tested
     *  | url | classification |
     */
    this.Then(/^the following classifications are tested$/, {timeout: 600000}, function(args) {
        console.log('Checking ('+(args.raw().length)+' classifications): ');
        const results = {tp: 0, tn: 0, fp: 0, fn: 0};
        return driver.wait(async () => {
            for (const row of args.raw()) {
                // console.log(row);
                const url = row[0];
                const classification = row[1];
                await selectDefaultWindow(driver);
                // Go to URL
                await stepHelpers.goToUrl(url);
                // Wait for processing to complete
                await selectBpFrame(driver);
                await stepHelpers.contentAnalysisComplete(driver);
                // Check Classification
                await stepHelpers.checkClassificationResult(classification, results, driver);
            }
            return true;
        }).then(() => {
            // Sensitivity = TP / TP + FN
            // Specificity = TN / TN + FP
            // Precision = TP / TP + FP
            // True-Positive Rate = TP / TP + FN
            // False-Positive Rate = FP / FP + TN
            // True-Negative Rate = TN / TN + FP
            // False-Negative Rate = FN / FN + TP
            const accuracy = (results.tp + results.tn) === 0 ? 0 : (((results.tp + results.tn)/(results.tp + results.tn + results.fp + results.fn))*100);
            const sensitivity = (results.tp + results.fn) === 0 ? 0 : (results.tp/(results.tp + results.fn));
            const specificity = (results.tn + results.fp) === 0 ? 0 : (results.tn/(results.tn + results.fp));
            const precision = (results.tp + results.fp) === 0 ? 0 : (results.tp/(results.tp + results.fp));
            console.log('Final correct score: '+(results.tp + results.tn)+'/'+(results.tp + results.tn + results.fn + results.fp));
            console.log('Final accuracy score: '+accuracy+'%');
            console.log('Final sensitivity score: '+sensitivity);
            console.log('Final specificity score: '+specificity);
            console.log('Final precision score: '+precision);
        });
    });

    // this.Given(/^the model is trained with the following classifications$/, {timeout: 600000}, async function(args) {
    //     console.log('Training ('+(args.raw().length)+' classifications): ');
    //     let progress = 0;
    //     await driver.wait(async () => {
    //         for (const row of args.raw()) {
    //             console.log('. ' + ++progress);
    //             // console.log(row);
    //             const url = row[0];
    //             const classification = row[1];
    //             await selectDefaultWindow(driver);
    //             // Go to URL
    //             await helpers.loadPage(url);
    //             // Wait for processing to complete
    //             await selectBpFrame(driver);
    //             await driver.wait(async () => {
    //                 await driver.wait(until.elementsLocated(by.css('.complete')));
    //                 const els = await driver.findElements(by.css('.complete'));
    //                 return await els[0].isDisplayed();
    //             });
    //             // Click to continue to view site
    //             await driver.wait(async () => {
    //                 await driver.wait(until.elementsLocated(by.css('#actionContinue')));
    //                 const els = await driver.findElements(by.css('#actionContinue'));
    //                 const visible = await els[0].isDisplayed();
    //                 if (visible) {
    //                     await els[0].click();
    //                     // await sleep(1000);
    //                     await selectDefaultWindow(driver);
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             });
    //             // Click classification
    //             await selectDefaultWindow(driver);
    //             await driver.wait(until.elementsLocated(by.css('#bp_training_frame')));
    //             await selectBpTrainingFrame(driver);
    //             const selector = classification === 'safe' ? '#actionMarkSafe'
    //                 : (classification === 'harmful' ? '#actionMarkHarmful'
    //                     : null);
    //             await driver.wait(async () => {
    //                 await driver.wait(until.elementsLocated(by.css(selector)));
    //                 const els = await driver.findElements(by.css(selector));
    //                 const visible = await els[0].isDisplayed();
    //                 if (visible) {
    //                     await els[0].click();
    //                     // await sleep(1000);
    //                     await selectDefaultWindow(driver);
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             });
    //         }
    //         return true;
    //     });
    //     return true;
    // });

    // this.Then(/^the following classifications are tested$/, {timeout: 600000}, async function(args) {
    //     let correct = 0;
    //     let wrong = 0;
    //     console.log('Checking ('+(args.raw().length)+' classifications): ');
    //     await driver.wait(async () => {
    //         for (const row of args.raw()) {
    //             // console.log(row);
    //             const url = row[0];
    //             const classification = row[1];
    //             await selectDefaultWindow(driver);
    //             // Go to URL
    //             await helpers.loadPage(url);
    //             // Wait for processing to complete
    //             await selectBpFrame(driver);
    //             await driver.wait(async () => {
    //                 await driver.wait(until.elementsLocated(by.css('.complete')));
    //                 const els = await driver.findElements(by.css('.complete'));
    //                 if (els.length) {
    //                     return await els[0].isDisplayed();
    //                 } else {
    //                     return false;
    //                 }
    //             });
    //             // Check Classification
    //             await driver.wait(async () => {
    //                 await driver.wait(until.elementsLocated(by.css('.result')));
    //                 const els = await driver.findElements(by.css('.result'));
    //                 if (!els.length) {
    //                     return false;
    //                 }
    //                 const visible = await els[0].isDisplayed();
    //                 const text = await els[0].getText();
    //                 if (visible) {
    //                     if (text === classification) {
    //                         correct++;
    //                         console.log('. ✓');
    //                     } else {
    //                         wrong++;
    //                         console.log('. X');
    //                     }
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             });
    //         }
    //         return true;
    //     });
    //     // Sensitivity = TP / TP + FN
    //     // Specificity = TN / TN + FP
    //     // Precision = TP / TP + FP
    //     // True-Positive Rate = TP / TP + FN
    //     // False-Positive Rate = FP / FP + TN
    //     // True-Negative Rate = TN / TN + FP
    //     // False-Negative Rate = FN / FN + TP
    //     const accuracy = correct === 0 ? 0 : ((correct/(wrong+correct))*100);
    //     console.log('Final accuracy score: '+accuracy+'%');
    //     return true;
    // });

    this.When(/^I do nothing$/, async () => true);
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
