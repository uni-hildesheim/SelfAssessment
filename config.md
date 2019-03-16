# Configuration

The SelfAssessment application is configurable to the following extend:

1. General Information
2. Angular Material Theme
3. Language
4. Course Expansion

### General Information

To change information like the application title, the footer or the application logo change the `resources.json` inside `/backend/data/config/` and adjust the specific properties:

```json
{
  "name": "Selfassessment v1.0",
  "header": "SelfAssessment",
  "footer": "&copy; 2019 Stiftung Universität Hildesheim",
  "vendor": {
    "name": "Stiftung Universität Hildesheim",
    "logo": "uni_hildesheim_logo.svg"
  }
}
```

### Angular Material Theme

The application uses a custom material theme which can be changed just like in any other application that uses angular material. To use a different theme change the `theme-color-palette` palette inside the `theme.scss` file and adjust the theme to your liking.

### Language and Course Expansion

See the extra documentation.