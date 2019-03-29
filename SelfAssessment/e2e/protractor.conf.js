// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    // The chrome browser doesnot works headless, so we are using
    // firefox headless instand.
  /** 'browserName': 'chrome',
    chromeOptions: {
      args: [ "--headless" ]
    } */
   'browserName': 'firefox',
    'moz:firefoxOptions': {
      args: ['--headless']
    } 
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
   // Add support for code coverage
  // See also https://github.com/edvlucas/angular-e2e-coverage
 /* onComplete() {
    console.log('E2E finished - retrieving coverage from browser');
    browser.executeScript('return JSON.stringify(window.__coverage__);').then((v) => {
      console.log(`Script executed - coverage info length is ${v.length}`);
      require('fs').writeFile("../../coverage-output/.nyc_output/coverage.json", v, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Coverage file extracted from server and saved to coverage.json");
      });
    })
} */
};