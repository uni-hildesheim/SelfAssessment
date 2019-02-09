# Self Assessment
[![Build Status](https://travis-ci.com/uni-hildesheim/SelfAssessment.svg?branch=master)](https://travis-ci.com/uni-hildesheim/SelfAssessment)

Self assessment web application, designed for aspiring students of the University of Hildesheim.

### Table of Contents
1. [Project Structure](#structure)  
2. [Code Style](#style)  
3. [Contributor guide](#contributing)  
4. [Continuous Integration](#travis)  

<a name="structure"></a>
## 1. Project Structure
* SelfAssessment: Angular frontend
* backend: Node.js backend
* .travis.yml: CI configuration, see [Continuous Integration](#travis)

Like any modern web application, this project is split into a frontend and a backend part. This means that deploying the project requires two servers to be running, one of them (the backend one) can be started using node, the frontend one should probably be deployed using nginx or similar software.

<a name="style"></a>
## 2. Code Style
* SelfAssessment: see tslint.json
* backend: .eslintrc.json

As long as your code matches the linting rules defined in the specific subproject dirs, it should be acceptable for the project.

<a name="contributing"></a>
## 3. Contributor guide

### git commit messages
Commit messages headers should look like this:

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

### code changes
Code changes are validated by our continuous integration process. More on that can be found in the [Continuous Integration](#travis) section. Right now, it performs automated javascript code linting, building and testing. If one of those validation processes fail, your code is highly unlikely to make it into the master (or any other) branch and should be revisited.

For further instructions and guidelines, please visit the component specific subdirectory and its README.md file.

<a name="travis"></a>
## 4. Continuous Integration
CI happens using the free and open source Travis CI service. Numerous branches are monitored and built, but the master branch is the most important one. The CI job will also be triggered for pull requests.

At the moment, the following steps are performed in order as part of the Travis build:

* lint (npm run lint)
* build (npm run build)
* test (npm run test)

If one of these 'stages' fail, subsequent ones are not executed.