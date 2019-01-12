// load dependencies
const express = require('express');

// static configuration
const PORT = 8000;

// create the app
const app = express();

// load the API routes
const routes = require('./app/routes/index.js')(app);

app.listen(PORT, () => {
  console.log('Server running on port: ' + PORT);
});
