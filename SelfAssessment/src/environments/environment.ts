import { LogLevel } from 'src/app/shared/logging/log.level.enum';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/***
 * General application settings.
 */
export const environment = {

  /**
   * The api url of the backend.
   */
  apiUrl: 'http://localhost:8000',

  /**
   * The log level.
   */
  loglevel: LogLevel.ALL,

  /**
   * Specifies the mode.
   */
  production: false,

  /**
   * The default language.
   */
  defaultLanguage: 'English'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
