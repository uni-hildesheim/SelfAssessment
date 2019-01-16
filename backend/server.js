// static configuration
var PORT = 8000;

for (arg of process.argv) {
  if (arg.startsWith('--port=')) {
    PORT = arg.split('=')[1];
  }
}

// load dependencies
const express = require('express');

// create the app
const app = express();

// load the API routes
const routes = require('./app/routes/index.js')(app);

// database initialization
const db = require('./app/mongodb/db.js');

app.listen(PORT, () => {
  console.log('Server running on port: ' + PORT);
});
