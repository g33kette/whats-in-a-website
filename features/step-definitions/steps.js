/**
 * @global {object} helpers
 *
 */
module.exports = function() {
    // add a before feature hook
    this.BeforeFeature(function(feature, done) {
        console.log('BeforeFeature: ' + feature.getName());
        // chrome_options = {};
        // chrome_options.add_extension('C:\Python\extension_3_19_6_0.crx');
        // driver = webdriver.Chrome(chrome_options=chrome_options);
        done();
    });

    this.When(/^I go to "([^"]*)"$/, function(url, callback) {
        // Write code here that turns the phrase above into concrete actions
        // var sw = require('selenium-webdriver');
        // var chromeOptions = sw.Capabilities.chrome();
        // chromeOptions.set("chromeOptions",  {"args": ['--load-extension='+"E:\\Localhost\\dissertation\\Extension\\dist"]});
        // var driver = new sw.Builder()
        //     .forBrowser('chrome')
        //     .withCapabilities(chromeOptions)
        //     .build();
        helpers.loadPage(url).then(function() {
            return callback();
        });
    });

    this.Then(/^I should see "([^"]*)"$/, function (arg1) {

        // driver wait returns a promise so return that
        return driver.wait(until.elementsLocated(by.css('asdasdasd')), 10000).then(function(){

            // return the promise of an element to the following then.
            return driver.findElements(by.css('body'));
        })
            .then(function (elements) {
                // verify this element has children
                helpers.getElementsContainingText('*', arg1).then((found) => {
                    expect(found.length).to.not.equal(0);
                });
            }, 5000);
    });
}

