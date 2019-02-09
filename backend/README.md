# Self Assessment backend

Node.js backend for the self assessment system.

### Table of Contents
1. [Project Structure](#structure)  
2. [Code Style](#style)  
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running](#running)  
6. [Testing](#testing)  
7. [REST API](#rest)  

<a name="structure"></a>
## 1. Project Structure

```sh
$ tree -d

.  
├── app  
│   ├── controller  
│   ├── model  
│   ├── mongodb  
│   ├── routes
│   └── utils
├── data
│   ├── assets
│   │   └── public
│   ├── autodeploy
│   ├── configs
│   └── db
└── spec
    ├── controller
    └── support
```
* **app**  
  Node.js app source code.

  * app/controller  
    Controller function which implement the actual logic that is exposed by the REST API routing.

  * app/model  
    Mongoose (--> MongoDB) schemas and models for well defined interactions on database objects.

  * app/mongodb  
    MongoDB connection handling and config storage.

  * app/routes  
    REST API routing.

  * app/utils  
    Various utilities used by the other components, including a custom logger module and course config validation. Right now, this is also abused as a staging area for modules which might soon be elsewhere (i.e. the validator).

* **data**  
  Runtime data used by the application. On initial deploy, this directory should only contain empty subdirectories.

  * data/assets  
    Assets such as images or misc data files that are required by other components.

  * data/assets/public  
    Public asset storage that can be accessed from the frontend, serving icons, images, etc.

  * data/autodeploy  
    ZIP files can be deployed here at runtime. The backend will automatically consume them (after checking the ZIP entries for validity), deploy configs and assets and rebuild the course collection in the database.

  * data/configs  
    Course configs (in JSON format) are stored here. They are processed and stored as raw JSON objects in the database and exposed to the Frontend through REST API routes.

  * data/db  
    MongoDB will populate this directory with content at runtime. All the DB metadata, its collections etc. are stored here.

* **spec**  
  Unit tests. At the moment, Jasmine is used as test runner and Sinon is used to stub e.g. Mongoose models.

  * spec/controller  
    Controller unit tests.

  * spec/support  
    Jasmine specific test runner configuration.

<a name="style"></a>
## 2. Code Style

ESLint is used for style checking. In short, the eslint/recommended and node/recommended rules are used in most cases. For specific rules, check the `.eslintrc.json` file.

Checking the codebase is done using:  
`npm run lint` or:  `eslint .`

<a name="installation"></a>
## 3. Installation

**NOTE:** The instructions below are only required for manual setup. If you feel comfortable running Docker containers, the manual steps listed here are not required.

Run

```sh
$ npm install
```
to populate the `node_modules` directory that holds all the depdendencies required to run the Node.js application.

Next, install and setup MongoDB. The steps for this depend on your operating system, so please search for instructions by using the search engine of your choice.

<a name="configuration"></a>
## 4. Configuration

### Environment
Deployment in a production environment should be done by modifying the `.env` file and altering parameters such as APP\_PORT or DB\_URI.

An example environment file is included in this git repository to showcase available options and providing a default configuration for quick testing.

<a name="running"></a>
## 5. Running

### Docker
A `Dockerfile` is provided to run the Node.js server part. For convenience purposes, a `docker-compose.yml` file is provided as well which starts the backend app **and** a MongoDB container as services that are automatically linked and accessible.

For a quick test deployment, the following should suffice to run the backend and database containers:

```sh
$ docker-compose up
```

Likewise,

```sh
$ docker-compose down
```
can be used to halt the containers and thus the Node.js app and the MongoDB database server.

### Manual
Start the Node.js application using:

```sh
$ node server.js
```

A MongoDB instance should be started using:

```sh
$ mongod --dbpath <path>
```

<a name="testing"></a>
## 6. Testing

### Unit tests
Unit tests reside in the `spec` subdirectory, as described in the project [structure](#structure). At the moment, only the Express.js controller part is covered, basic things like routing still need to be done.

We use Jasmine as our test runner of choice.
To run the unit tests, execute

```sh
$ npm run test
```

### Writing tests
Implementing or extending a feature requires writing new unit tests for new codepaths. In Node.js projects, unit tests are often tightly coupled to the ORM (**O**bject **R**elational **M**apper). In this project, Mongoose is used as ORM for the MongoDB database.

In this section, we are going to show how we write our own tests for this project to give you an idea of how your tests should look like when contributing.

For a simple test with no database interaction, the following should suffice:

```javascript
describe('Jasmine unit test example', () => {
    it('2+2 should equal 4', async () => {
        const number1 = 2;
        const number2 = 2;

        expect(number1+number2).toBe(4);
    });
}
```

In case of a more complex test with some kind of database interaction, we make use of *sinonjs*. Sinon gives us the ability to stub methods, observe method execution and parameters as well as return values and more.

To demonstrate the use of *sinonjs*, here is an example for a controller unit test:

```javascript
describe('CourseController', () => {
    const docs = [
        {
            name: 'IMIT',
            language: 'en',
            configs: [
                {
                    "title": "IMIT",
                    "icon": "imit.png",
                    // ... redacted
                }
            ]
        }
    ];

    beforeEach( () => {
        // common response object with spies
        this.res = {
            json: sinon.spy(),
            status: sinon.stub().returns({
                json: sinon.spy()
            })
        };
    });

    afterEach( () => {
        // cleanup and remove stubs
        sinon.restore();
    });

	describe('.loadConfig(req, res)', () => {
	    it('should return HTTP 404 for invalid name', async () => {
	        sinon.stub(CourseModel, 'findOne').resolves(null);
	
	        const req = {
	            body: {
	                name: 'garbage'
	            }
	        };
	
	        await CourseController.loadConfig(req, this.res);
	        sinon.assert.calledOnce(CourseModel.findOne);
	        sinon.assert.calledOnce(this.res.status);
	        sinon.assert.calledWith(this.res.status, 404);
	        sinon.assert.calledOnce(this.res.status().json);
	        sinon.assert.calledWith(this.res.status().json, { error: 'No such course: ' +
	                                                          req.body.name });
	    });
	
	    it('should load the dummy course from the stub DB', async () => {
	        sinon.stub(CourseModel, 'findOne').resolves(docs[0]);
	
	        const req = {
	            body: {
	                name: docs[0].name
	            }
	        };
	
	        await CourseController.loadConfig(req, this.res);
	        sinon.assert.calledOnce(CourseModel.findOne);
	        sinon.assert.calledOnce(this.res.status);
	        sinon.assert.calledWith(this.res.status, 200);
	        sinon.assert.calledOnce(this.res.status().json);
	        sinon.assert.calledWith(this.res.status().json, docs[0].config);
	    });
	});
}
```

Here, we are testing the loadConfig method of the Course controller. There are five basic steps involved:

1. Setting up a "stub" database with dummy documents (see the docs variable)
2. Defining common actions to execute before and after each test (see beforeEach() and afterEach())
3. Describing the actual tests

The stub database is what will be used in the actual tests to operate on. We leverage the beforeEach() and afterEach() hooks to sanitize the sinon sandbox, reset stubbed objects and prepare common spies. Please consult the *sinonjs* documentation to get to know about spies, stubs and other basic sinon building blocks. Last but not least, we employ sinon asserts to check on the spy parameters, how often they were called, etc.

<a name="rest"></a>
## 7. REST API

### Course (v1)
* GET `/api/v1/course`  
  Retrieve available courses. Returns an array of strings as JSON.

  Example output:  

  ```
  [
      {
        "name": "IMIT",
        "icon": "imit.png",
        "languages": [
          "en"
        ]
      },
      {
        "name": "WINF",
        "icon": "winf.png",
        "languages": [
          "de",
          "en"
        ]
      }
  ]
  ```

* POST `/api/v1/course/loadConfig`  
  Retrieve the configuration of a course (which is required for the frontend). The request body must contain exactly two attributes: 'name' and 'language'. Returns the raw object from DB as JSON.

  Example input:

  ```
  {
      "name": "IMIT",
      "language": "en"
  }
  ```

  Example output:

  ```
  {
      "title": "IMIT",
      "checksum_regex": "AI([A-Z][A-Z][A-Z][a-z][a-z][a-z][a-z][a-z][0-9][0-9])%9",
      ...
  }
  ```

### Journal (v1)
* POST `/api/v1/journal/load` (DEPRECATED)  
  Retrieve the journal object for a given pincode. The request body must contain exactly one attribute 'pin'. Returns the raw object from DB as JSON.

  Example input:

  ```
  {
      "pin": 62211357
  }
  ```

  Example output:

  ```
  {
      "_id": "5c41d3b7b32830eec3312e7a",
      "associatedPin": 62211357,
      "__v": 0,
      "log": ...,
      "structure": ...
  }
  ```

* POST `/api/v1/journal/log/load`  
  Retrieve the journal log object for a given pincode. The request body must contain exactly one attribute 'pin'. Returns the raw object from DB as JSON.

  Example input:

  ```
  {
      "pin": 62211357
  }
  ```

  Example output:

  ```
  {
      "sets": [
        {
          "maps": [
            {
              "val": [
                false,
                true
              ],
              "key": 1001
            },
          ]
        },
        {
          "maps": [
            {
              "val": [
                false,
                false
              ],
              "key": 1003
            }
          ]
        }
      ]
  }
  ```

* POST `/api/v1/journal/log/save` (DEPRECATED)  
  Write the journal log object for a given pincode into the DB. The request body must contain exactly one attribute 'pin'. Returns HTTP 200 on success, HTTP 500 otherwise.

  Example input:

  ```
  {
      "pin": 62211357
  }
  ```

* POST `/api/v1/journal/structure/load`  
  Retrieve the journal structure object for a given pincode. The request body must contain exactly one attribute 'pin'. Returns the raw object from DB as JSON.

  Example input:

  ```
  {
      "pin": 62211357
  }
  ```

  Example output:

  ```
  {
      "course": "IMIT",
      "sets": [
        {
          "tests": [
            1001,
          ],
          "set": 3001
        },
        {
          "tests": [
            1003
          ],
          "set": 3002
        }
      ]
  }
  ```

* POST `/api/v1/journal/structure/save`  
  Write the journal structure object for a given pincode into the DB. The request body must contain exactly one attribute 'pin'. Returns HTTP 200 on success, HTTP 500 otherwise.

  Example input:

  ```
  {
      "pin": 62211357
  }
  ```

### Pincode (v1)
* GET `/api/v1/pincode/create`  
  Create a new pincode object in the DB. Along with the pin itself, the controller stores the creation date so objects can be dropped from the DB by using filters.

  Example output:  

  ```
  62211357
  ```
