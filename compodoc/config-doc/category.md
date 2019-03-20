# Introducing new Category to the application

Here are some important notes to keep in mind when introducing a new category to the application.

## Frontend

### Define new model 

The necessary files for the categories are located here:

```
/SelfAssessment/src/app/shared/models

├── procedure
│   ├── categories
│   │   ├── match.test.ts
│   │   ├── multiple.choice.test.ts
│   │   ├── multiple.options.test.ts
│   │   └── radio.buttons.test.ts
│   ├── enums
│   │   ├── category.enum.ts
```

Each category has a unique model and a unique enum type.

Make sure to first create a new enum type inside the `category.enum.ts`. 

```typescript
export enum Category {
    RADIO_BUTTONS = 'radio-buttons',
    MULTIPLE_CHOICE = 'multiple-choice',
    MULTIPLE_OPTIONS = 'multiple-options',
    MATCH = 'match'
}
```

The string value of the enum is the value that is input into the course configuration file.

Proceed by creating a new `.ts` file extending which exports the new Category and extends the **Test** class, make sure to set the new enum type like this:

```typescript
export class RadioButtons extends Test {
    category: Category =  Category.RADIO_BUTTONS;
}
```

### Create new Component

Every category has its own component with an own template that dictates the view and and an own controller that dictates how journal-log changes are handled (more on that later).

The category-components are located here:

```
SelfAssessment/src/app/testpanel/components/single-test-card
.
└── categories
    ├── match
    ├── multiple-choice
    ├── multiple-options
    └── radio-buttons
```

Create a new component.

Make sure the newly created component extends the `CategoryComponent` interface, implement the variables and the handleModelChange method.

```typescript
export interface CategoryComponent {
    test: Test;
    models: any[];
    handleModelChange(value: any, i: number, j?: number);
}
```

* **test**: Every Component has a reference to the actual test instance.

* **models**: Array which keeps track of the answers which a users checked/unchecked/matched etc. This Array is referenced inside the journal-log.

  It also is used for two-way binding with the view. Make sure to consider this when designing the view.

* **handleModelChange**: This method should be called from the view if there is a change that needs to be handled.

Lastly go to the `categories.ts` file inside the `single-test-card` directory and tell extend the `getNewComponent` Method, which tells angular what component to dynamically inject.



## Backend

1. create *name.js* inside testmodels directory

   ```
   backend/app/core/course/testmodels
   .
   └── testmodels
       ├── base.js
       ├── index.js
       ├── match.js
       ├── multiple_choice.js
       ├── multiple_option.js
       └── radio_button.js
   
   ```

2. Extend the `BaseTest` class and implement the methods:

   ```javascript
       get maxScore() { }
   
       loadConfig(config) { }
   
       calculateResult(log) { }
   ```

   

3. Extend `index.js` inside app/core/course/testmodels

   ```
   module.exports = {
       Models: [
           require('./match'),
           require('./multiple_choice'),
           require('./multiple_option'),
           require('./radio_button')
       ]
   }
   ```

   