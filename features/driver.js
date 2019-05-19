module.exports = function() {
var sw = require('selenium-webdriver');
var chromeOptions = sw.Capabilities.chrome();
chromeOptions.set("chromeOptions",  {"args": ['--load-extension='+"E:\\Localhost\\dissertation\\Extension\\dist"]});
var driver = new sw.Builder()
    .forBrowser('chrome')
    .withCapabilities(chromeOptions)
    .build();

return driver;
}
