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

// create the app
const app = express();

// load the API routes
require('./app/routes/index.js')(app);

// database initialization
console.log('MongoDB URI: ' + DB_URI);
db.mongoose.connect(DB_URI, db.config.options);

db.mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
db.mongoose.connection.once('connected', function () {
    console.log('MongoDB connected successfully!');
});

app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT);
});
