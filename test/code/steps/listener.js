const { When } = require('cucumber');

When('I see the app', async function() {
    await this.alertsPage.dismissNotificationsAlert();
    await this.startPage.loginButton;
});

When('I send a number to the app', async function() {
    const number = Math.ceil(Math.random() * 10000);
    this.number = number;
    this.responseNumber = await this.listener.request(number);
});

When('I receive the same number back', async function() {
    this.responseNumber.should.equal(this.number);
});
