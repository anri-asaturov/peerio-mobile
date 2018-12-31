const { setDefaultTimeout, setWorldConstructor, Before, After, Status } = require('cucumber');
const World = require('./world');
const chai = require('chai');

chai.should();
const defaultTimeout = 240000;
let initialReset = false;

setDefaultTimeout(defaultTimeout);

setWorldConstructor(World);

Before('@noCacheReset', function() {
    this.context.platform.desiredCapabilities.noReset = true;
});

Before(async function() {
    this.attach(`Platform: ${this.context.platform.desiredCapabilities.platformName}`);
    this.attach(`Version: ${this.context.platform.desiredCapabilities.platformVersion}`);
    await this.openApp();
    if (!initialReset) {
        console.log(`Pre-feature app reset`);
        initialReset = true;
        await this.closeApp();
        await this.openApp();
        console.log(`Pre-feature app reset complete`);
    }
});

After(async function() {
    await this.closeApp();
});

After(async function() {
    this.destroy();
});

After(async function(scenario) {
    if (scenario.result.status === Status.FAILED) {
        await this.takeScreenshot();
    }
});
