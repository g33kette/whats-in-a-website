module.exports = function() {
    const wd = require('selenium-webdriver');

    const chromeOptions = wd.Capabilities.chrome();
    chromeOptions.set('chromeOptions', {'args': ['--load-extension='+__dirname+'\\..\\dist']});

    const prefs = new wd.logging.Preferences();
    prefs.setLevel('browser', wd.logging.Level.ALL);
    prefs.setLevel('driver', wd.logging.Level.ALL);
    chromeOptions.setLoggingPrefs(prefs);

    const builder = new wd.Builder()
        .forBrowser('chrome')
        .withCapabilities(chromeOptions)
        .setLoggingPrefs(prefs);
    return builder.build();
};
