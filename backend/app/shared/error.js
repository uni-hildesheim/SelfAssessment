/**
 * Error codes used for frontend communication.
 * If a HTTP error code is returned (e.g. 404 or 500), the backend shall send an error code with a
 * meaningful message attached.
 */
const ServerError = {
    E_UNKNOWN: {
        number: 0,
        message: 'Unknown error'
    },
    E_ACCESS: {
        number: 1,
        message: 'Permission denied'
    },
    E_DBIO: {
        number: 2,
        message: 'DB input/output error'
    },
    E_DBQUERY: {
        number: 3,
        message: 'No element found in DB'
    },
    E_INVAL: {
        number: 4,
        message: 'Invalid request parameters'
    }
};

module.exports = {
    ServerError
}
