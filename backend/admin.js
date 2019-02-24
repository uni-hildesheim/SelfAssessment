// 3rdparty dependencies
const crypto = require('crypto');
const mongoose = require('mongoose');

// local dependencies
const db = require('./app/db/db');
const logger = require('./app/utils/logger');

async function dropDatabase(args) { // eslint-disable-line no-unused-vars
    logger.info('dropDatabase()');

    try {
        await mongoose.connection.db.dropDatabase();
    } catch (err) {
        logger.error(err);
        return;
    }

    return true;
}

async function dropCollection(args) {
    if (!('name' in args)) {
        logger.error('missing arg: name');
        return false;
    }

    logger.info('dropCollection(' + args.name + ')');

    try {
        await mongoose.connection.db.dropCollection(args.name);
    } catch (err) {
        logger.error(err);
        return;
    }

    return true;
}

async function listCollections(args) { // eslint-disable-line no-unused-vars
    let collections;

    logger.info('listCollections()');

    try {
        collections = await mongoose.connection.db.listCollections().toArray();
    } catch (err) {
        logger.error(err);
        return;
    }

    console.log('Collections')
    for (const collection of collections) {
        console.log('--> ' + collection.name);
    }

    return true;
}

async function hashPassword(args) {
    let sha512;

    if (!('secret' in args)) {
        logger.error('missing arg: secret');
        return false;
    }

    sha512 = crypto.createHmac('sha512', args.secret);

    if ('salt' in args) {
        sha512.update(args.salt);
    }

    console.log(sha512.digest('hex'));
    return true;
}

async function findUser(args) {
    let result;
    let query = {};

    if ('pin' in args) {
        query['pin'] = args.pin
    }

    logger.info('findUser(' + JSON.stringify(query) + ')');

    try {
        result = await db.User.find(query);
    } catch (err) {
        logger.error(err);
        return;
    }

    console.log(JSON.stringify(result, null, 2));

    return true;
}

async function deleteAllUsers(args) { // eslint-disable-line no-unused-vars
    let result;
    let query = {};

    logger.info('deleteAll()');

    try {
        result = await db.User.deleteMany(query);
    } catch (err) {
        logger.error(err);
        return;
    }

    console.log('Deleted: ' + result.n);
    return true;
}

async function deleteManyUsers(args) {
    let result;
    let query = {};

    if (!('done' in args) && !('lastUpdate' in args) && !('pin' in args)) {
        logger.error('must supply at least one arg: done, lastUpdate, pin');
        return false;
    }

    if ('done' in args) {
        if (args.done == true) {
            query['result.validationCode'] = {
                '$ne': null
            }
        } else {
            query['result.validationCode'] = null;
        }
    }

    if ('lastUpdate' in args) {
        const referenceDate = new Date();
        referenceDate.setDate(referenceDate.getDate() - args.lastUpdate);
        query['journal.lastUpdate'] = {
            '$lt': referenceDate
        };
    }

    if ('pin' in args) {
        query.pin = args.pin;
    }

    logger.info('deleteMany(' + JSON.stringify(query) + ')');

    try {
        result = await db.User.deleteMany(query);
    } catch (err) {
        logger.error(err);
        return;
    }

    console.log('Deleted: ' + result.n);
    return true;
}

async function listUsers(args) { // eslint-disable-line no-unused-vars
    let result;
    let query = {};

    logger.info('findUser(' + JSON.stringify(query) + ')');

    try {
        result = await db.User.find(query);
    } catch (err) {
        logger.error(err);
        return;
    }

    for (const user of result) {
        console.log('--> ' + user.pin + ' (' + user.created + ')');
    }

    return true;
}

const ACTIONS = {
    'info': {
        args: [],
        handler: printInfo
    },
    'help': {
        args: [],
        handler: usage
    },
    'db': {
        'drop': {
            args: [],
            handler: dropDatabase
        }
    },
    'collection': {
        'drop': {
            args: ['name'],
            handler: dropCollection
        },
        'list': {
            args: [],
            handler: listCollections
        }
    },
    'password': {
        'hash': {
            args: ['secret', 'salt'],
            handler: hashPassword
        }
    },
    'user': {
        'find': {
            args: ['pin'],
            handler: findUser
        },
        'delete': {
            'all': {
                args: [],
                handler: deleteAllUsers
            },
            'many': {
                args: ['done', 'lastUpdate', 'pin'],
                handler: deleteManyUsers
            }
        },
        'list': {
            args: [],
            handler: listUsers
        }
    }
}

function usage() {
    let node = ACTIONS;
    let indent = 0;

    console.log('Usage: node admin.js ARGS');

    function parseTree(node) {
        let string = '';
        indent += 2;
        for (let i = 0; i < indent; i++) {
            string += ' ';
        }
        for (const item in node) {
            console.log(string + item);
            if (!('args' in node[item])) {
                parseTree(node[item]);
            } else {
                // found a leaf node
                for (const arg of node[item]['args']) {
                    console.log(string + '  <' + arg + '>')
                }
                console.log('');
            }
        }
    }

    parseTree(node);
}

function printInfo() {
    console.log('MongoDB config: ' + JSON.stringify(db.config, null, 2));
}

function loadEnvironment() {
    const APP_LOGLEVEL = process.env.APP_LOGLEVEL;
    const DB_URI = process.env.DB_URI;
    const DB_USER = process.env.DB_USER;
    const DB_PASS = process.env.DB_PASS;

    if (DB_URI) {
        logger.info('env: DB_URI=' + DB_URI);
        db.config.uri = DB_URI;
    }

    if (DB_USER) {
        logger.info('env: DB_USER=' + DB_USER);
        db.config.options.user = DB_USER;
    }

    if (DB_PASS) {
        logger.info('env: DB_PASS=' + DB_PASS);
        db.config.options.pass = DB_PASS;
    }

    if (APP_LOGLEVEL) {
        if (!(APP_LOGLEVEL in logger.Level)) {
            logger.warn('Invalid log level specified: ' + APP_LOGLEVEL);
        } else {
            logger.info('env: APP_LOGLEVEL=' + APP_LOGLEVEL);
            logger.setLogLevel(APP_LOGLEVEL);
        }
    }
}

function run(args) {
    let arg = args[0];
    let dict = ACTIONS;

    while (arg) {
        if (!(arg in dict)) {
            // invalid argument chain, bail out
            break;
        } else {
            // pick the key and advance the dict
            dict = dict[arg];
            args.shift();
            arg = args[0];
            continue;
        }
    }

    if (!('handler' in dict)) {
        if (!arg) {
            logger.error('Missing argument');
        } else {
            logger.error('Invalid argument part: ' + arg);
        }
        logger.error('Should be one of: ' + Object.keys(dict));
        return null;
    }

    return dict.handler;
}

async function main() {
    let args = process.argv;
    // remove the first two arguments (node.js path and script path)
    args.splice(0, 2);

    logger.setLogLevel(logger.Level.INFO);

    // load env config for DB parameters and such
    loadEnvironment();

    const handler = await run(args);
    if (handler === null) {
        return null;
    }

    // connect to DB
    logger.all('Connecting to MongoDB: ' + db.config.uri);
    try {
        await db.connect(db.config.uri, db.config.options);
    } catch(err) {
        logger.error('Failed to connect to DB: ' + err);
        return null;
    }

    const handlerArgs = {};
    for (const arg of args) {
        const elems = arg.split('=');
        if (elems.length < 2) {
            // TODO
            continue
        }

        handlerArgs[elems[0]] = elems[1];
    }

    return await handler(handlerArgs);
}

if (require.main == module) {
    main().then(result => {
        process.exit(result === true ? 0 : 1); // eslint-disable-line no-process-exit
    }).catch(err => {
        logger.error(err);
        process.exit(1); // eslint-disable-line no-process-exit
    });
}
