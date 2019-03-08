export const Level = {
  ALL: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  properties: {
      0: { string: 'ALL', method: console.log },
      1: { string: 'ERROR', method: console.error },
      2: { string: 'WARN', method: console.warn },
      3: { string: 'INFO', method: console.info },
      4: { string: 'DEBUG', method: console.debug }
  }
};
