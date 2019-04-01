# Self Assessment frontend

<a name="models"></a>

## Models

The following UML diagram shows the composition of the frontend-models.

The diagram uses the typescript specific language design (`number`, `string`, `?` for optional parameters).

NOTE: It only depicts a fraction of the entire code, since the components, views, pipes etc. are not shown.

To learn more about those you can use the generated compodoc-documentation.

![Frontend models](../images/models_frontend.svg)



<a name="testing"></a>

## Testing

To run the tests for the frontend do the following inside `SelfAssessment/SelfAssessment`:

```bash
$ npm run test-headless
```

This runs all specs in the `ChromeHeadless` mode.

To generate a code-coverage report do the following:

```bash
$ npm run coverage
```

Open the index.html inside the generated converage directory to see the report:

![Frontend models](../images/coverage_frontend.png)



### e2e Tests without config files ###

This project has two kinds of e2e tests: the ones that do not dependent on any config file and the ones that do.

To run the first kind of tests do the following inside `SelfAssessment/SelfAssessment:`

```bash
$ ng e2e
```

This runs all specs in the `chromeHeadless` mode.



To exit the  `chromeHeadless` mode and to switch to a non headless mode, replace the code inside`SelfAssessment/SelfAssessment/e2e/protractor.config.js` at the line 12 with the following statement:

```javascript
'browserName': 'chrome'
```

To switch back to `chromeHeadless` mode the following code has to be put inside `SelfAssessment/SelfAssessment/e2e/protractor.config.js` at the lines 12 to 15:

```javascript
'browserName': 'chrome',
'chromeOptions':  {
   args: ['--headless'] 
}
```

The output after running the tests, should look something like this:

![Frontend models](..\images\e2eTest_example_headless_frontend.jpg)





