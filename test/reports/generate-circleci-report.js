const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'hierarchy',
    jsonDir: 'test/reports',
    output: `${process.env.CIRCLE_ARTIFACTS}/result.html`,
    reportSuiteAsScenarios: true,
    launchReport: false
};

reporter.generate(options);
