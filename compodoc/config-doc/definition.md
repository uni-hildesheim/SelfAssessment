# Adding Course

The following text describes the process of creating a new test definition file for the self-assessment system. 

**Important**: Read the Language support section first.

## Step 1: General information

Create a new file for example: `my-test-definition.json`

This file has the following base structure:

1. Choose a course title
2. Create a validation schema
3. Pick a course image

```json
{
  "title": "IMIT",
  "validationSchema": "AI([A-Z][A-Z][A-Z][a-z][a-z][a-z][a-z][a-z][0-9][0-9])%9",
  "icon": "imit.jpg",
  ...
}
```



## Step 2: Creating the tests

After the `icon` attribute provide all the tests that you want to display (or potentially display) across the application.

Every test has the following attributes.

* **id**: A unique id to reference the test, can be a string although a number is encouraged
* **type**: A type to group different tests together
* **description**: The test description
* **task**: The task of the test
* **options**: The different answers from which a user can choose
  * text: The content of the option
  * correct: Whether this option is correct (boolean for most categories)
* **evaluated**: Boolean to indicate if the test should be evaluated
* **seconds:** If provided the test becomes a speed with the seconds attribute as the time limit
* **category**:

  1. **radio-buttons:** A user can choose one of the following answers
  2. **multiple-choice:** A user can choose multiple answers
  3. **multiple-options:** Every possible answer has a number of header values
  4. **match:** The user has to pick a substring from a text

> multiple-options: There needs to be another attribute: **header** for the different header values.

#### The option attribute:

|         | radio-buttons | multiple-choice | multiple-options                                             | match                                                  |
| ------- | ------------- | --------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| text    | The option    | The option      | The option, which is going to be paired with the respective header values | The text from which the user has to choose a substring |
| correct | boolean       | boolean         | Index of the correct header                                  | The specific substring                                 |
| index   | ___           | ___             | ___                                                          | Index at which the correct substring occurs            |

**NOTE:** Since the matching of the text from a match-test is language sensitive it is important to reference the index as well as the substring.

Example-Option for the match test:

```json
"options": [
    {
        "text": "?ref{1005-3}",
        "correct": "?ref{1005-3-1}",
        "index": "?ref{1005-3-2}"
    }
```

Example for a radio-buttons test:

  ```json
  {
    "id": 1001,
    "type": "logic",
    "category": "radio-buttons",
    "description": "?ref{1001-1}",
    "task": "?ref{1001-2}",
    "options": [
      {
        "text": "?ref{1001-3}",
        "correct": true
      },
      {
        "text": "?ref{1001-4}"
      }
    ],
    "evaluated": true
  }
  ```

Example for multiple-options test:

  ```json
  {
    "id": 1002,
    "type": "logic",
    "category": "multiple-options",
    "description": "?ref{1002-1}",
    "task": "?ref{1002-2}",
    "header": ["?ref{1002-3-1}", "?ref{1002-3-2}"],
    "options": [
      {
        "text": "?ref{1002-4}",
        "correct": 0
      },
      {
        "text": "?ref{1002-5}",
        "correct": 1
      }
    ],
    "evaluated": true
  }
  ```

 Add these tests to the `tests` array in the config file, the order is irrelevant (only here).

```json
{
  "title": "IMIT",
  "validationSchema": "AI([A-Z][A-Z][A-Z][a-z][a-z][a-z][a-z][a-z][0-9][0-9])%9",
  "icon": "imit.jpg",
  "tests": [
      {
          // Add the test 1001
      },
      {
          // Add the test 1002
      }
  ]
}
```



## Step 3: Creating testgroups

A `testgroup` is an arrangement of multiple tests.  Every group has the following attributes:

* **id: **A unique id to reference the group, can be a string although a number is encouraged
* **tests**: An array which contains all the different tests which should be added to this group
* **select**: Optional attribute which, if provided, states the number of tests which should be randomly choosen from the tests array 

Example for the testgroup:

```json
  "testgroups": [
    {
      "id": 2001,
      "tests": [
        1001, 1002
      ],
      "select": 1
    }
  ]
```

Add this `testgroup` array below the `tests` array.



## Step 4: Assembling the test sets

A test `set` is a grouping of tests and testgroups. It has the following attributes:

*  **id**: A unique id to reference the set, can be a string although a number is encouraged
* **elements**:  The set elements which can be test or a testgroup
*  **evaluationTexts**: Set specific texts to show the user during the evaluation
  * **scoreIndependent**:  Text that is shown to every user
  * **scoreDependent**: Array of score dependent text, from which one text is shown to the user depending on the users score. See the example below: *33* means that the text in that array is shown to every user who achieved a score of 33% or less. 66% means that the text in that array is shown to every user who's score is greater than 33% but smaller than 66% etc.

Example for a test set:

```json
  "sets": [
    {
      "id": 3001,
      "elements": [
        2001,
        1003
      ],
      "evaluationTexts": {
        "scoreIndependent": "?ref{3001-1}",
        "scoreDependent": [
          [33, "?ref{3001-2}"],
          [66, "?ref{3001-3}"],
          [100, "?ref{3001-4}"]
        ]
      }
    }
  ]
```



## Step 5: Add Infopages

An `infopage` provides a help text that is shown before a `test`, `testgroup` or a `set`. It has the following attributes:

* **id**: A unique id
* **text**: The content which should be displayed
* **belongs**: Array of ids to which this page belongs

Example for an infopage:

```json
  "infopages": [
    {
      "id": 4001,
      "text": "?ref{4001-1}",
      "belongs": [
        3001
      ]
    }
  ]
```



## Additional Information:

### Images:

To show images inside the texts you need to add an HTML tag at the specific place. Because the image should not change for different languages make sure you add the tag not the language files, but to the actual configuration file like that:

```json
  {
    "id": 1001,
    "description": "?ref{1001-1} <img src='name-of-img.png'/>",
	...
  }
```



### **LaTeX** Equations:

The application supports latex equations which can be added to the different texts, options, infopages etc. Just like the images the equations should not depend on a specific language which is why they also should be added not to the language file but to the configuration file. To a latex equation within a text you need to wrap it inside two `$$` signs, like that:

```json
  {
    "id": 1001,
    "description": "?ref{1001-1} $$\\sum_{i=1}^nx_i$$  ref{1001-2}/>",
	...
  }
```