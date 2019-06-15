module.exports = function() {
    const sw = require('selenium-webdriver');
    const chromeOptions = sw.Capabilities.chrome();
    chromeOptions.set('chromeOptions', {'args': ['--load-extension=E:\\Localhost\\dissertation\\Extension\\dist']});
    // chromeOptions.set('chromeOptions', {'args': ['--load-extension=C:\\Users\\Jo\\Desktop\\chrome-plugin\\dist']});
    return new sw.Builder()
        .forBrowser('chrome')
        .withCapabilities(chromeOptions)
        .build();
};
