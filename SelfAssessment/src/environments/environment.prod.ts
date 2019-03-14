/***
 * General application settings.
 */
export const environment = {
  /**
   * Specifies the mode.
   */
  production: true,

  /**
   * The api url of the backend.
   * MUST BE CHANGED BEFORE DEPLOYMENT HAPPENS.
   */
  apiUrl: 'http://localhost:8000',

  logSettings: {
    level: 0,
    logtime: true,
    logBufferSize: 5
  },

  /**
   * The default language.
   */
  defaultLanguage: 'English'
};
