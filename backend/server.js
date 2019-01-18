// static configuration
var PORT = 8000;

const db = require('./app/mongodb/db.js');
var DB_URI = db.config.uri;

for (var arg of process.argv) {
    if (arg.startsWith('--port=')) {
        PORT = arg.split('=')[1];
    } else if (arg.startsWith('--mongouri=')) {
        DB_URI = arg.split('=')[1];
    }
}

// load dependencies
const express = require('express');
const bodyParser = require('body-parser');

// create the app
const app = express();
app.use(bodyParser.json())

// load the API routes
require('./app/routes/index.js')(app);

// database initialization
console.log('MongoDB URI: ' + DB_URI);
db.connect(DB_URI, db.config.options);

app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT);
});
