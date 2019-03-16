# Language Support 

The Language Support for this application is twofold. First the overall static text content. That includes the text on buttons, labels, notifications, help text etc. Secondly the specific course content. Every course can have many different language files.

That means that the number of languages supported by the static context does not need to match the number of languages support by a specific course. 

E.g the static content might support English, German and French whilst the course '*IMIT*' only supports English and German.

This setup makes the language support very flexible, since it is possible to expand the language support for any given course at a later point in time.

All the relevant language files are located in the following directories inside the backend:

```bash
/backend/data/config
.
├── courses
│   ├── imit.json
│   └── i18n
│       └── imit_en.json
└── frontend
    ├── i18n
    │   ├── resources_de.json
    │   └── resources_en.json
    └── resources.json
```



## Static Content

The `resources.json` contains all the replaceable strings off the application. 

```json
{
  // ...
  "strings": {
    "language": "?ref{language}",
    "btn-start": "?ref{btn-start}",
    "lbl-pin-request": "?ref{lbl-pin-request}"

  }
}

```

The `resources_de.json` contains all the german translations.

```json
{
  // ...
  "strings": {
    "language": "Deutsch",
    "btn-start": "Starten",
    "lbl-pin-request": "Bitte geben Sie ihren PIN ein."
  }
}

```

The `resources_en.json` contains all the english translations.

```json
{
  // ...
  "strings": {
    "language": "English",
    "btn-start": "Start",
    "lbl-pin-request": "Please provide your PIN."
  }
}

```

To add a new language to the static content just create a new file, e.g. `resources_fr.json`. Inside that file copy the basic configuration setup and then translate the key, values pairs defined inside the `resources.json` file.

## Course Content

The `courses` directory contains all all the different course configuration files with their respective translations inside the i18n directory. 

The `imit_en.json` file contains all the refs which you can use inside the `imit.json` file

```json
{
  "language": "English",
  "?refs": {
    "1001-1": "This is a simple radio-buttons test.",
    "1001-2": "Can you <i>see</i> the <b>nice</b> HTML<sup>5</sup> formatting?",
    "1001-3": "Yes"
  }
}

```

**NOTE**: You can choose the labels for the refs by yourself but it is recommended to use the following pattern: `"<id_of_test>-<number_of_ref_inside_test>"`.

Inside `imit.json` file you can reference the refs like that:

```json
// ...  
"tests": [
    {
      "id": 1001,
      "type": "logic",
      "category": "radio-buttons",
      "description": "?ref{1001-1}",
      "task": "?ref{1001-2}",
      "options": [
        {
          "text": "?ref{1001-3}"
        },
        {
          "text": "?ref{1001-4}"
        }
      ],
      "evaluated": false
    }
]
```

**NOTE**: You can also break down text by using multiple refs inside a string. That is particularly useful if you have some language-independent content e.g. a complex latex equation. For example:

```json
// refs:
    "1008-1": "This is a long language specifc text before the equation.",
    "1008-2": "I Am also a very long text but i come after the equation."
// used like that:
    "description": "?ref{1008-1} $$\\sum_{i=1}^{n}\\frac{12}{i}$$ ?ref{1008-2}",

```



