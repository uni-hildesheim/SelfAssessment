# Contributing

### Table of Contents
1. [Component Ownership](#components)
2. [Pull Requests](#pullreqs)

<a name="components"></a>

## 1. Component Ownership

* **Jonathan Lochmann**
  * Frontend
  * Jasmine unit tests
  * Documentation
  * Theme styling
  * Compodoc setup
  * UI
* **Christopher Hesse**
  * Backend
  * Jasmine unit tests
  * Documentation
  * Continuous integration
  * Project & Docker setup
  * UX
* **Paul Blanke**
  * e2e tests
  * extended example course config (not part of the master branch)

<a name="pullreqs"></a>

## 1. Pull Requests

Pull requests are welcome! Please submit them to our [GitHub repository](https://github.com/uni-hildesheim/SelfAssessment). Generally, you should respect the contributor guidelines in this file, especially code styling and git commit message formatting.

As long as your code matches the linting rules defined in the specific subproject dirs, it should be acceptable for the project.

List of automated linter configurations:

* SelfAssessment: tslint.json
* backend: .eslintrc.json

You can validate the current codebase by running:

```js
npm run lint
```

in the respective sub directory (Selfassessment or backend).

Git commit messages should generally look like this:

```
component: Change summary

Here comes the additional commit message content.
The 'component' should be something like 'app' for frontend or 'server'
for backend.
The change summary starts with a capital letter and is a short and
concise description of the change.

As a general rule of thumb, we follow the classic 50/72 rule.
That means the first line of your commit (also referred to as summary
here) should not exceed 50 characters. Next up is exactly one line,
followed by an arbitrary number of additional lines describing the
commit, which must not exceed 72 characters each.
```

Patching nested components may of course invalidate the 50 char rule for the first line, meaning summaries such as:

`server: test: multiple-choice: Fix result calculation logic`

are generally accepted.