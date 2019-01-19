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
const cors = require('cors');

// create the app
const app = express();
app.use(bodyParser.json())

// load the API routes
require('./app/routes/index.js')(app);

// enable cross-origin resource sharing
const corsOptions = {
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// database initialization
console.log('MongoDB URI: ' + DB_URI);
db.connect(DB_URI, db.config.options);

app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT);
});
